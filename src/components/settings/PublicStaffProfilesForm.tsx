import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface PublicStaffProfile {
  id?: string;
  staffId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  specialties: string[];
  yearsExperience?: number;
  isVisible: boolean;
  displayOrder: number;
}

interface Staff {
  id: string;
  name: string;
}

export const PublicStaffProfilesForm = () => {
  const { toast } = useToast();
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [profile, setProfile] = useState<PublicStaffProfile>({
    staffId: '',
    displayName: '',
    bio: '',
    profileImageUrl: '',
    specialties: [],
    yearsExperience: 0,
    isVisible: true,
    displayOrder: 0
  });

  // Fetch staff members
  const { data: staff = [] } = useQuery({
    queryKey: ['staff', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name')
        .eq('tenant_id', tenantId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Staff[];
    },
    enabled: !!tenantId
  });

  // Fetch public staff profiles
  const { data: publicProfiles = [] } = useQuery({
    queryKey: ['public_staff_profiles', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_staff_profiles')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId
  });

  // Save/update profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (profileData: PublicStaffProfile) => {
      const data = {
        tenant_id: tenantId,
        staff_id: profileData.staffId,
        display_name: profileData.displayName,
        bio: profileData.bio,
        profile_image_url: profileData.profileImageUrl,
        specialties: profileData.specialties,
        years_experience: profileData.yearsExperience,
        is_visible: profileData.isVisible,
        display_order: profileData.displayOrder,
        updated_at: new Date().toISOString()
      };

      if (profileData.id) {
        const { error } = await supabase
          .from('public_staff_profiles')
          .update(data)
          .eq('id', profileData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_staff_profiles')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public_staff_profiles', tenantId] });
      toast({
        title: "Success",
        description: "Staff profile saved successfully",
      });
      resetForm();
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save staff profile",
        variant: "destructive",
      });
    }
  });

  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('public_staff_profiles')
        .delete()
        .eq('id', profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public_staff_profiles', tenantId] });
      toast({
        title: "Success",
        description: "Staff profile deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff profile",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setProfile({
      staffId: '',
      displayName: '',
      bio: '',
      profileImageUrl: '',
      specialties: [],
      yearsExperience: 0,
      isVisible: true,
      displayOrder: 0
    });
    setSelectedStaffId('');
  };

  const loadProfile = (publicProfile: any) => {
    setProfile({
      id: publicProfile.id,
      staffId: publicProfile.staff_id,
      displayName: publicProfile.display_name,
      bio: publicProfile.bio || '',
      profileImageUrl: publicProfile.profile_image_url || '',
      specialties: publicProfile.specialties || [],
      yearsExperience: publicProfile.years_experience || 0,
      isVisible: publicProfile.is_visible,
      displayOrder: publicProfile.display_order
    });
    setSelectedStaffId(publicProfile.staff_id);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaffId(staffId);
    const selectedStaff = staff.find(s => s.id === staffId);
    if (selectedStaff) {
      setProfile(prev => ({
        ...prev,
        staffId,
        displayName: prev.displayName || selectedStaff.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.staffId || !profile.displayName) {
      toast({
        title: "Error",
        description: "Staff member and display name are required",
        variant: "destructive",
      });
      return;
    }
    saveProfileMutation.mutate(profile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Staff Profiles</CardTitle>
        <CardDescription>
          Manage how your staff members appear on the public booking page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Profiles */}
        {publicProfiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Existing Staff Profiles</h4>
            <div className="grid gap-4">
              {publicProfiles.map((publicProfile: any) => {
                const staffMember = staff.find(s => s.id === publicProfile.staff_id);
                return (
                  <div key={publicProfile.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{publicProfile.display_name}</div>
                      <div className="text-sm text-gray-600">
                        Staff: {staffMember?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={publicProfile.is_visible ? "default" : "secondary"}>
                          {publicProfile.is_visible ? "Visible" : "Hidden"}
                        </Badge>
                        {publicProfile.specialties?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {publicProfile.specialties.length} specialties
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadProfile(publicProfile)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProfileMutation.mutate(publicProfile.id)}
                        disabled={deleteProfileMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="staffSelect">Staff Member *</Label>
              <select
                id="staffSelect"
                value={selectedStaffId}
                onChange={(e) => handleStaffSelection(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                required
              >
                <option value="">Select a staff member</option>
                {staff.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="How this staff member appears publicly"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell customers about this staff member..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profileImageUrl">Profile Image URL</Label>
              <Input
                id="profileImageUrl"
                value={profile.profileImageUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, profileImageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                value={profile.yearsExperience}
                onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialty(specialty)}>
                  {specialty} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                value={profile.displayOrder}
                onChange={(e) => setProfile(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={profile.isVisible}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isVisible: checked }))}
              />
              <Label htmlFor="isVisible">Visible on public page</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveProfileMutation.isPending}>
              {saveProfileMutation.isPending ? "Saving..." : profile.id ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

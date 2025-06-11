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

interface PublicServiceProfile {
  id?: string;
  serviceId: string;
  displayName: string;
  description?: string;
  imageUrl?: string;
  features: string[];
  isVisible: boolean;
  displayOrder: number;
  onlineBookingEnabled: boolean;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export const PublicServiceProfilesForm = () => {
  const { toast } = useToast();
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [newFeature, setNewFeature] = useState('');
  const [profile, setProfile] = useState<PublicServiceProfile>({
    serviceId: '',
    displayName: '',
    description: '',
    imageUrl: '',
    features: [],
    isVisible: true,
    displayOrder: 0,
    onlineBookingEnabled: true
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration')
        .eq('tenant_id', tenantId);
      
      if (error) throw error;
      return data as Service[];
    },
    enabled: !!tenantId
  });

  // Fetch public service profiles
  const { data: publicProfiles = [] } = useQuery({
    queryKey: ['public_service_profiles', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_service_profiles')
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
    mutationFn: async (profileData: PublicServiceProfile) => {
      const data = {
        tenant_id: tenantId,
        service_id: profileData.serviceId,
        display_name: profileData.displayName,
        description: profileData.description,
        image_url: profileData.imageUrl,
        features: profileData.features,
        is_visible: profileData.isVisible,
        display_order: profileData.displayOrder,
        online_booking_enabled: profileData.onlineBookingEnabled,
        updated_at: new Date().toISOString()
      };

      if (profileData.id) {
        const { error } = await supabase
          .from('public_service_profiles')
          .update(data)
          .eq('id', profileData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_service_profiles')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public_service_profiles', tenantId] });
      toast({
        title: "Success",
        description: "Service profile saved successfully",
      });
      resetForm();
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save service profile",
        variant: "destructive",
      });
    }
  });

  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('public_service_profiles')
        .delete()
        .eq('id', profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public_service_profiles', tenantId] });
      toast({
        title: "Success",
        description: "Service profile deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete service profile",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setProfile({
      serviceId: '',
      displayName: '',
      description: '',
      imageUrl: '',
      features: [],
      isVisible: true,
      displayOrder: 0,
      onlineBookingEnabled: true
    });
    setSelectedServiceId('');
  };

  const loadProfile = (publicProfile: any) => {
    setProfile({
      id: publicProfile.id,
      serviceId: publicProfile.service_id,
      displayName: publicProfile.display_name,
      description: publicProfile.description || '',
      imageUrl: publicProfile.image_url || '',
      features: publicProfile.features || [],
      isVisible: publicProfile.is_visible,
      displayOrder: publicProfile.display_order,
      onlineBookingEnabled: publicProfile.online_booking_enabled
    });
    setSelectedServiceId(publicProfile.service_id);
  };

  const addFeature = () => {
    if (newFeature.trim() && !profile.features.includes(newFeature.trim())) {
      setProfile(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setProfile(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleServiceSelection = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const selectedService = services.find(s => s.id === serviceId);
    if (selectedService) {
      setProfile(prev => ({
        ...prev,
        serviceId,
        displayName: prev.displayName || selectedService.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.serviceId || !profile.displayName) {
      toast({
        title: "Error",
        description: "Service and display name are required",
        variant: "destructive",
      });
      return;
    }
    saveProfileMutation.mutate(profile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Service Profiles</CardTitle>
        <CardDescription>
          Manage how your services appear on the public booking page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Profiles */}
        {publicProfiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Existing Service Profiles</h4>
            <div className="grid gap-4">
              {publicProfiles.map((publicProfile: any) => {
                const service = services.find(s => s.id === publicProfile.service_id);
                return (
                  <div key={publicProfile.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{publicProfile.display_name}</div>
                      <div className="text-sm text-gray-600">
                        Service: {service?.name || 'Unknown'} 
                        {service && <span className="ml-2">${service.price} • {service.duration}min</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={publicProfile.is_visible ? "default" : "secondary"}>
                          {publicProfile.is_visible ? "Visible" : "Hidden"}
                        </Badge>
                        <Badge variant={publicProfile.online_booking_enabled ? "default" : "secondary"}>
                          {publicProfile.online_booking_enabled ? "Bookable" : "Not Bookable"}
                        </Badge>
                        {publicProfile.features?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {publicProfile.features.length} features
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
              <Label htmlFor="serviceSelect">Service *</Label>
              <select
                id="serviceSelect"
                value={selectedServiceId}
                onChange={(e) => handleServiceSelection(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration}min)
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
                placeholder="How this service appears publicly"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this service for customers..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">Service Image URL</Label>
              <Input
                id="imageUrl"
                value={profile.imageUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/service-image.jpg"
              />
            </div>
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
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(feature)}>
                  {feature} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={profile.isVisible}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isVisible: checked }))}
              />
              <Label htmlFor="isVisible">Visible on public page</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="onlineBookingEnabled"
                checked={profile.onlineBookingEnabled}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, onlineBookingEnabled: checked }))}
              />
              <Label htmlFor="onlineBookingEnabled">Enable online booking</Label>
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

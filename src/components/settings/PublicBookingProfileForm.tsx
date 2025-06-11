
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
import { ExternalLink } from 'lucide-react';

interface PublicBookingProfile {
  id?: string;
  slug: string;
  displayName: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  isActive: boolean;
}

export const PublicBookingProfileForm = () => {
  const { toast } = useToast();
  const { tenantId } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<PublicBookingProfile>({
    slug: '',
    displayName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    isActive: false
  });

  useEffect(() => {
    if (tenantId) {
      fetchProfile();
    }
  }, [tenantId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('public_business_profiles')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          slug: data.slug,
          displayName: data.display_name,
          description: data.description || '',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          address: data.address || '',
          isActive: data.is_active
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load public booking profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleDisplayNameChange = (name: string) => {
    setProfile(prev => ({
      ...prev,
      displayName: name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) {
      toast({
        title: "Error",
        description: "No tenant selected",
        variant: "destructive",
      });
      return;
    }

    if (!profile.slug || !profile.displayName) {
      toast({
        title: "Error", 
        description: "Slug and display name are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        tenant_id: tenantId,
        slug: profile.slug,
        display_name: profile.displayName,
        description: profile.description,
        contact_email: profile.contactEmail,
        contact_phone: profile.contactPhone,
        address: profile.address,
        is_active: profile.isActive,
        updated_at: new Date().toISOString()
      };

      if (profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from('public_business_profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('public_business_profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) throw error;
        
        setProfile(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Success",
        description: "Public booking profile saved successfully",
      });

      // Also create default booking settings if they don't exist
      const { error: settingsError } = await supabase
        .from('booking_settings')
        .upsert({
          tenant_id: tenantId,
          advance_booking_days: 30,
          min_advance_hours: 2,
          max_advance_hours: 720,
          allow_same_day_booking: true,
          require_customer_phone: false,
          require_customer_notes: false,
          auto_confirm_bookings: false,
          send_confirmation_email: true,
          send_reminder_email: true,
          reminder_hours_before: 24,
          updated_at: new Date().toISOString()
        });

      if (settingsError) {
        console.error('Error creating booking settings:', settingsError);
      }

    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      if (error.code === '23505' && error.constraint === 'public_business_profiles_slug_unique') {
        toast({
          title: "Error",
          description: "This slug is already taken. Please choose a different one.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save public booking profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const publicUrl = profile.slug ? `${window.location.origin}/book/${profile.slug}` : '';

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading public booking profile...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Booking Profile</CardTitle>
        <CardDescription>
          Set up your public booking page that customers can use to book appointments online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={profile.isActive}
              onCheckedChange={(checked) => 
                setProfile(prev => ({ ...prev, isActive: checked }))
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="isActive" className="font-medium">
              Enable Public Bookings
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                placeholder="Your Business Name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={profile.slug}
                onChange={(e) => setProfile(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="your-business-name"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used in your booking URL
              </p>
            </div>
          </div>

          {profile.slug && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-blue-800">
                Your Public Booking URL:
              </Label>
              <div className="flex items-center mt-1 space-x-2">
                <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                  {publicUrl}
                </code>
                {profile.isActive && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(publicUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your business and services..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={profile.contactEmail}
                onChange={(e) => setProfile(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@yourbusiness.com"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={profile.contactPhone}
                onChange={(e) => setProfile(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main St, City, State 12345"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? "Saving..." : "Save Public Booking Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

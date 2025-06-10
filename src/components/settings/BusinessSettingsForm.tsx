
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useTenantDetails } from '@/hooks/useTenantDetails';
import { useBusinessTypes } from '@/hooks/useBusinessTypes';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export const BusinessSettingsForm = () => {
  const { toast } = useToast();
  const { tenantId } = useTenant();
  const { data: tenantDetails, isLoading: isLoadingTenant, refetch } = useTenantDetails();
  const { data: businessTypes, isLoading: isLoadingBusinessTypes } = useBusinessTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    business_type: '',
    description: '',
    owner_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (tenantDetails) {
      setFormData({
        name: tenantDetails.name || '',
        business_type: tenantDetails.business_type || '',
        description: tenantDetails.description || '',
        owner_name: tenantDetails.owner_name || '',
        email: tenantDetails.email || '',
        phone: tenantDetails.phone || ''
      });
    }
  }, [tenantDetails]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name: formData.name,
          business_type: formData.business_type,
          description: formData.description,
          owner_name: formData.owner_name,
          email: formData.email,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Business information updated successfully",
      });

      // Refetch the tenant details to update the UI
      refetch();
    } catch (error) {
      console.error('Error updating business information:', error);
      toast({
        title: "Error",
        description: "Failed to update business information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTenant) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading business information...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Update your business details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter business name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select 
                onValueChange={(value) => handleInputChange('business_type', value)}
                disabled={isSubmitting || isLoadingBusinessTypes}
                value={formData.business_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingBusinessTypes ? "Loading..." : "Select business type"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {businessTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your business services and what makes you special..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                value={formData.owner_name}
                onChange={(e) => handleInputChange('owner_name', e.target.value)}
                placeholder="Enter owner name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="email">Business Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="business@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Business Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? "Updating..." : "Update Business Information"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

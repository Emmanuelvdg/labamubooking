
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CreateTenantData {
  businessName: string;
  businessType: string;
  description?: string;
  ownerName: string;
  email: string;
  phone?: string;
}

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tenantData: CreateTenantData) => {
      console.log('Creating tenant:', tenantData);
      
      // Transform form data to database schema
      const dbTenant = {
        name: tenantData.businessName,
        business_type: tenantData.businessType,
        description: tenantData.description || null,
        owner_name: tenantData.ownerName,
        email: tenantData.email,
        phone: tenantData.phone || null,
      };

      console.log('Database tenant object:', dbTenant);

      const { data, error } = await supabase
        .from('tenants')
        .insert([dbTenant])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tenant:', error);
        throw error;
      }
      
      console.log('Tenant created successfully:', data);
      
      // Transform response back to camelCase for frontend
      return {
        id: data.id,
        name: data.name,
        businessType: data.business_type,
        createdAt: data.created_at,
      } as Tenant;
    },
    onSuccess: (data) => {
      console.log('Tenant creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: 'Success',
        description: 'Business created successfully',
      });
    },
    onError: (error) => {
      console.error('Tenant creation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to create business',
        variant: 'destructive',
      });
    },
  });
};

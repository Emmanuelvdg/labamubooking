
import { supabase } from '@/integrations/supabase/client';
import { CreateTenantData } from '@/types/tenant';

export const useTenantCreation = () => {
  const createTenantRecord = async (tenantData: CreateTenantData) => {
    // Get current user for existing user flow
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create the tenant record with only the provided data
    const dbTenant = {
      name: tenantData.businessName,
      business_type: tenantData.businessType,
      description: tenantData.description || null,
      owner_name: tenantData.ownerName || user?.email?.split('@')[0] || 'Business Owner',
      email: tenantData.email || user?.email || '',
      phone: tenantData.phone || null,
    };

    console.log('Creating tenant record with data:', dbTenant);

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
    return data;
  };

  return { createTenantRecord };
};

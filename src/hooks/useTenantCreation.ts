
import { supabase } from '@/integrations/supabase/client';
import { CreateTenantData } from '@/types/tenant';

export const useTenantCreation = () => {
  const createTenantRecord = async (tenantData: CreateTenantData) => {
    // Create the tenant record with only the provided data - no synthetic data
    const dbTenant = {
      name: tenantData.businessName,
      business_type: tenantData.businessType,
      description: tenantData.description || null,
      owner_name: tenantData.ownerName,
      email: tenantData.email,
      phone: tenantData.phone || null,
    };

    console.log('Creating tenant record with clean data:', dbTenant);

    const { data, error } = await supabase
      .from('tenants')
      .insert([dbTenant])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
    
    console.log('Tenant created successfully with empty data tables:', data);
    return data;
  };

  return { createTenantRecord };
};

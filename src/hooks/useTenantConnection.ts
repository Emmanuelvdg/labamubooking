
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ConnectUserToTenantData {
  userId: string;
  tenantId: string;
  role: string;
}

export const useConnectUserToTenant = () => {
  return useMutation({
    mutationFn: async ({ userId, tenantId, role }: ConnectUserToTenantData) => {
      console.log('Connecting user to tenant:', { userId, tenantId, role });
      
      // First, check if connection already exists
      const { data: existingConnection, error: checkError } = await supabase
        .from('user_tenants')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing connection:', checkError);
        throw checkError;
      }

      if (existingConnection) {
        console.log('User-tenant connection already exists:', existingConnection);
        return existingConnection;
      }

      // Create new connection
      const { data, error } = await supabase
        .from('user_tenants')
        .insert([
          {
            user_id: userId,
            tenant_id: tenantId,
            role: role,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error connecting user to tenant:', error);
        throw error;
      }

      console.log('User connected to tenant successfully:', data);
      
      // Verify the connection was created successfully
      const { data: verification, error: verifyError } = await supabase
        .from('user_tenants')
        .select(`
          id,
          tenant_id,
          role,
          created_at,
          tenant:tenants (
            id,
            name,
            business_type
          )
        `)
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .single();

      if (verifyError) {
        console.error('Error verifying user-tenant connection:', verifyError);
        throw verifyError;
      }

      console.log('User-tenant connection verified:', verification);
      return data;
    },
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export const useTenantDetails = () => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['tenant-details', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('No tenant ID available');
      }

      console.log('Fetching tenant details for:', tenantId);

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) {
        console.error('Error fetching tenant details:', error);
        throw error;
      }

      console.log('Fetched tenant details:', data);
      return data;
    },
    enabled: !!tenantId,
  });
};

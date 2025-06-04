
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ExternalCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const useSyncCustomers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tenantId: string) => {
      // Fetch customers from external API
      const response = await fetch('https://www.labamu.co.id/v1/customer');
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers from external API');
      }
      
      const externalCustomers: ExternalCustomer[] = await response.json();
      
      // Transform and insert customers into our database
      const customersToInsert = externalCustomers.map(customer => ({
        tenant_id: tenantId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
      }));

      const { data, error } = await supabase
        .from('customers')
        .upsert(customersToInsert, { 
          onConflict: 'email,tenant_id',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: `Synced ${data?.length || 0} customers successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to sync customers from external API',
        variant: 'destructive',
      });
      console.error('Error syncing customers:', error);
    },
  });
};

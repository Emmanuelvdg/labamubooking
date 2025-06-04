
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
      console.log('Starting customer sync for tenant:', tenantId);
      // Fetch customers from external API
      const response = await fetch('https://www.labamu.co.id/v1/customer');
      
      if (!response.ok) {
        console.error('External API request failed:', response.status, response.statusText);
        throw new Error('Failed to fetch customers from external API');
      }
      
      const externalCustomers: ExternalCustomer[] = await response.json();
      console.log('Fetched external customers:', externalCustomers);
      
      // Transform and insert customers into our database
      const customersToInsert = externalCustomers.map(customer => ({
        tenant_id: tenantId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
      }));

      console.log('Customers to insert:', customersToInsert);

      const { data, error } = await supabase
        .from('customers')
        .upsert(customersToInsert, { 
          onConflict: 'email,tenant_id',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error('Database upsert error:', error);
        throw error;
      }
      
      console.log('Sync completed successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sync successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: `Synced ${data?.length || 0} customers successfully`,
      });
    },
    onError: (error) => {
      console.error('Sync failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync customers from external API',
        variant: 'destructive',
      });
    },
  });
};

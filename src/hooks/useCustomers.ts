
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useCustomers = (tenantId: string) => {
  return useQuery({
    queryKey: ['customers', tenantId],
    queryFn: async () => {
      console.log('Fetching customers for tenant:', tenantId);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      
      console.log('Fetched customers:', data);
      // Transform snake_case to camelCase
      return data.map(customer => ({
        id: customer.id,
        tenantId: customer.tenant_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
      })) as Customer[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id'>) => {
      console.log('Creating customer:', customer);
      // Transform camelCase to snake_case for database
      const dbCustomer = {
        tenant_id: customer.tenantId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
      };

      console.log('Database customer object:', dbCustomer);

      const { data, error } = await supabase
        .from('customers')
        .insert([dbCustomer])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating customer:', error);
        throw error;
      }
      
      console.log('Customer created successfully:', data);
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
      };
    },
    onSuccess: (data) => {
      console.log('Customer creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
    },
    onError: (error) => {
      console.error('Customer creation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to create customer',
        variant: 'destructive',
      });
    },
  });
};

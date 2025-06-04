
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useCustomers = (tenantId: string) => {
  return useQuery({
    queryKey: ['customers', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
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
      // Transform camelCase to snake_case for database
      const dbCustomer = {
        tenant_id: customer.tenantId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([dbCustomer])
        .select()
        .single();
      
      if (error) throw error;
      
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
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create customer',
        variant: 'destructive',
      });
      console.error('Error creating customer:', error);
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useServices = (tenantId: string) => {
  return useQuery({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return data.map(service => ({
        id: service.id,
        tenantId: service.tenant_id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
      })) as Service[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      // Transform camelCase to snake_case for database
      const dbService = {
        tenant_id: service.tenantId,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
      };

      const { data, error } = await supabase
        .from('services')
        .insert([dbService])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create service',
        variant: 'destructive',
      });
      console.error('Error creating service:', error);
    },
  });
};

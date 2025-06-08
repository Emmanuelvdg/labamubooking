
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useServices = (tenantId: string) => {
  return useQuery({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      console.log('Fetching services for tenant:', tenantId);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories(
            id,
            name,
            description,
            color
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched services:', data);
      
      // Transform snake_case to camelCase
      return data.map(service => ({
        id: service.id,
        tenantId: service.tenant_id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        categoryId: service.category_id,
        category: service.service_categories ? {
          id: service.service_categories.id,
          tenantId: service.tenant_id,
          name: service.service_categories.name,
          description: service.service_categories.description,
          color: service.service_categories.color,
        } : undefined,
      })) as Service[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      console.log('Creating service:', service);
      
      // Transform camelCase to snake_case for database
      const dbService = {
        tenant_id: service.tenantId,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category_id: service.categoryId,
      };

      const { data, error } = await supabase
        .from('services')
        .insert([dbService])
        .select(`
          *,
          service_categories(
            id,
            name,
            description,
            color
          )
        `)
        .single();
      
      if (error) throw error;
      
      console.log('Created service:', data);
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        categoryId: data.category_id,
        category: data.service_categories ? {
          id: data.service_categories.id,
          tenantId: data.tenant_id,
          name: data.service_categories.name,
          description: data.service_categories.description,
          color: data.service_categories.color,
        } : undefined,
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

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: Service) => {
      console.log('Updating service:', service);
      
      // Transform camelCase to snake_case for database
      const dbService = {
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category_id: service.categoryId,
      };

      const { data, error } = await supabase
        .from('services')
        .update(dbService)
        .eq('id', service.id)
        .select(`
          *,
          service_categories(
            id,
            name,
            description,
            color
          )
        `)
        .single();
      
      if (error) throw error;
      
      console.log('Updated service:', data);
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        categoryId: data.category_id,
        category: data.service_categories ? {
          id: data.service_categories.id,
          tenantId: data.tenant_id,
          name: data.service_categories.name,
          description: data.service_categories.description,
          color: data.service_categories.color,
        } : undefined,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive',
      });
      console.error('Error updating service:', error);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (serviceId: string) => {
      console.log('Deleting service:', serviceId);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      
      console.log('Service deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
      console.error('Error deleting service:', error);
    },
  });
};

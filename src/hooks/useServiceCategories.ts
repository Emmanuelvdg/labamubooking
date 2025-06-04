
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ServiceCategory {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const useServiceCategories = (tenantId: string) => {
  return useQuery({
    queryKey: ['service-categories', tenantId],
    queryFn: async () => {
      console.log('Fetching service categories for tenant:', tenantId);
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      console.log('Fetched service categories:', data);
      
      // Transform snake_case to camelCase
      return data.map(category => ({
        id: category.id,
        tenantId: category.tenant_id,
        name: category.name,
        description: category.description,
        color: category.color,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      })) as ServiceCategory[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating service category:', category);
      
      // Transform camelCase to snake_case for database
      const dbCategory = {
        tenant_id: category.tenantId,
        name: category.name,
        description: category.description,
        color: category.color,
      };

      const { data, error } = await supabase
        .from('service_categories')
        .insert([dbCategory])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Created service category:', data);
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        color: data.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
      console.error('Error creating service category:', error);
    },
  });
};

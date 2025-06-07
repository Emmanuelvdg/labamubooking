
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StaffRole {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useStaffRoles = (tenantId: string) => {
  return useQuery({
    queryKey: ['staff-roles', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_roles')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return data.map(role => ({
        id: role.id,
        tenantId: role.tenant_id,
        name: role.name,
        description: role.description,
        permissions: role.permissions || [],
        isActive: role.is_active,
        createdAt: role.created_at,
        updatedAt: role.updated_at,
      })) as StaffRole[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateStaffRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (role: Omit<StaffRole, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Transform camelCase to snake_case for database
      const dbRole = {
        tenant_id: role.tenantId,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        is_active: role.isActive,
      };

      const { data, error } = await supabase
        .from('staff_roles')
        .insert([dbRole])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        permissions: data.permissions || [],
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-roles'] });
      toast({
        title: 'Success',
        description: 'Staff role created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create staff role',
        variant: 'destructive',
      });
      console.error('Error creating staff role:', error);
    },
  });
};

export const useUpdateStaffRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...role }: StaffRole) => {
      // Transform camelCase to snake_case for database
      const dbRole = {
        tenant_id: role.tenantId,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        is_active: role.isActive,
      };

      const { data, error } = await supabase
        .from('staff_roles')
        .update(dbRole)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        description: data.description,
        permissions: data.permissions || [],
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-roles'] });
      toast({
        title: 'Success',
        description: 'Staff role updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update staff role',
        variant: 'destructive',
      });
      console.error('Error updating staff role:', error);
    },
  });
};

export const useDeleteStaffRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff_roles')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-roles'] });
      toast({
        title: 'Success',
        description: 'Staff role deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete staff role',
        variant: 'destructive',
      });
      console.error('Error deleting staff role:', error);
    },
  });
};

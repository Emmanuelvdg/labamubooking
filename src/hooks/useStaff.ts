
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Staff } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useStaff = (tenantId: string) => {
  return useQuery({
    queryKey: ['staff', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return data.map(staff => ({
        id: staff.id,
        tenantId: staff.tenant_id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        roleId: staff.role_id,
        skills: staff.skills || [],
        avatar: staff.avatar,
        isActive: staff.is_active,
      })) as Staff[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staff: Omit<Staff, 'id'>) => {
      // Transform camelCase to snake_case for database
      const dbStaff = {
        tenant_id: staff.tenantId,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        role_id: staff.roleId,
        skills: staff.skills,
        avatar: staff.avatar,
        is_active: staff.isActive,
      };

      const { data, error } = await supabase
        .from('staff')
        .insert([dbStaff])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        email: data.email,
        role: data.role,
        roleId: data.role_id,
        skills: data.skills || [],
        avatar: data.avatar,
        isActive: data.is_active,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create staff member',
        variant: 'destructive',
      });
      console.error('Error creating staff:', error);
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...staff }: Staff) => {
      // Transform camelCase to snake_case for database
      const dbStaff = {
        tenant_id: staff.tenantId,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        role_id: staff.roleId,
        skills: staff.skills,
        avatar: staff.avatar,
        is_active: staff.isActive,
      };

      const { data, error } = await supabase
        .from('staff')
        .update(dbStaff)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        email: data.email,
        role: data.role,
        roleId: data.role_id,
        skills: data.skills || [],
        avatar: data.avatar,
        isActive: data.is_active,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
      console.error('Error updating staff:', error);
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete staff member',
        variant: 'destructive',
      });
      console.error('Error deleting staff:', error);
    },
  });
};


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
      return data as Staff[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staff: Omit<Staff, 'id'>) => {
      const { data, error } = await supabase
        .from('staff')
        .insert([staff])
        .select()
        .single();
      
      if (error) throw error;
      return data;
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

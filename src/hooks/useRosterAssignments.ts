
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RosterAssignment } from '@/types/roster';
import { toast } from 'sonner';

export const useRosterAssignments = (tenantId: string) => {
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ['roster-assignments', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roster_assignments')
        .select(`
          *,
          staff:staff_id (
            id,
            name,
            email,
            role
          )
        `)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as RosterAssignment[];
    },
    enabled: !!tenantId,
  });

  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<RosterAssignment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('roster_assignments')
        .insert(assignment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
      toast.success('Roster assignment created successfully');
    },
    onError: (error) => {
      console.error('Error creating roster assignment:', error);
      toast.error('Failed to create roster assignment');
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RosterAssignment> & { id: string }) => {
      const { data, error } = await supabase
        .from('roster_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
      toast.success('Roster assignment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating roster assignment:', error);
      toast.error('Failed to update roster assignment');
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roster_assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
      toast.success('Roster assignment deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting roster assignment:', error);
      toast.error('Failed to delete roster assignment');
    },
  });

  const checkConflicts = useMutation({
    mutationFn: async ({ 
      assignmentId, 
      staffId, 
      startTime, 
      endTime 
    }: {
      assignmentId?: string;
      staffId: string;
      startTime: string;
      endTime: string;
    }) => {
      const { data, error } = await supabase.rpc('check_roster_conflicts', {
        p_assignment_id: assignmentId || null,
        p_staff_id: staffId,
        p_start_time: startTime,
        p_end_time: endTime,
        p_tenant_id: tenantId
      });

      if (error) throw error;
      return data;
    },
  });

  return {
    assignments,
    isLoading,
    error,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    checkConflicts,
  };
};

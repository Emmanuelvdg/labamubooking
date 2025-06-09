
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
      
      // Transform database records to match TypeScript interface
      return (data || []).map((record: any): RosterAssignment => ({
        id: record.id,
        tenantId: record.tenant_id,
        staffId: record.staff_id,
        startTime: record.start_time,
        endTime: record.end_time,
        status: record.status,
        assignmentType: record.assignment_type,
        notes: record.notes,
        createdBy: record.created_by,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        staff: record.staff ? {
          id: record.staff.id,
          name: record.staff.name,
          email: record.staff.email,
          role: record.staff.role
        } : undefined
      }));
    },
    enabled: !!tenantId,
  });

  const invalidateAllCalendarData = () => {
    // Invalidate all calendar-related queries
    queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['staff-schedules', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['schedule-instances', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['bookings', tenantId] });
  };

  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<RosterAssignment, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Transform TypeScript interface to database columns
      const dbRecord = {
        tenant_id: assignment.tenantId,
        staff_id: assignment.staffId,
        start_time: assignment.startTime,
        end_time: assignment.endTime,
        status: assignment.status,
        assignment_type: assignment.assignmentType,
        notes: assignment.notes,
        created_by: assignment.createdBy
      };

      const { data, error } = await supabase
        .from('roster_assignments')
        .insert(dbRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAllCalendarData();
      toast.success('Roster assignment created successfully');
    },
    onError: (error) => {
      console.error('Error creating roster assignment:', error);
      toast.error('Failed to create roster assignment');
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RosterAssignment> & { id: string }) => {
      // Transform TypeScript interface to database columns for updates
      const dbUpdates: any = {};
      if (updates.tenantId !== undefined) dbUpdates.tenant_id = updates.tenantId;
      if (updates.staffId !== undefined) dbUpdates.staff_id = updates.staffId;
      if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
      if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.assignmentType !== undefined) dbUpdates.assignment_type = updates.assignmentType;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.createdBy !== undefined) dbUpdates.created_by = updates.createdBy;

      const { data, error } = await supabase
        .from('roster_assignments')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAllCalendarData();
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
      invalidateAllCalendarData();
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

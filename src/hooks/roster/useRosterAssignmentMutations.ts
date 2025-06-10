
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RosterAssignment } from '@/types/roster';
import { toast } from 'sonner';

interface UseRosterAssignmentMutationsProps {
  tenantId: string;
}

export const useRosterAssignmentMutations = ({ tenantId }: UseRosterAssignmentMutationsProps) => {
  const queryClient = useQueryClient();

  const invalidateAllCalendarData = () => {
    console.log('Invalidating all calendar data for tenant:', tenantId);
    // Invalidate all calendar-related queries
    queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['staff-schedules', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['schedule-instances', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['bookings', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['calendar-data', tenantId] });
  };

  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<RosterAssignment, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating roster assignment:', assignment);
      
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

      console.log('Database record to insert:', dbRecord);

      const { data, error } = await supabase
        .from('roster_assignments')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }
      
      console.log('Created assignment result:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Roster assignment created successfully:', data.id);
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
      console.log('Updating roster assignment:', id, updates);
      
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

      console.log('Database updates to apply:', dbUpdates);

      const { data, error } = await supabase
        .from('roster_assignments')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }
      
      console.log('Updated assignment result:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Roster assignment updated successfully:', data.id);
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
      console.log('Deleting roster assignment:', id);
      
      const { error } = await supabase
        .from('roster_assignments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database delete error:', error);
        throw error;
      }
      
      console.log('Deleted assignment successfully:', id);
    },
    onSuccess: (_, id) => {
      console.log('Roster assignment deleted successfully:', id);
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
      console.log('Checking roster conflicts:', { assignmentId, staffId, startTime, endTime });
      
      const { data, error } = await supabase.rpc('check_roster_conflicts', {
        p_assignment_id: assignmentId || null,
        p_staff_id: staffId,
        p_start_time: startTime,
        p_end_time: endTime,
        p_tenant_id: tenantId
      });

      if (error) {
        console.error('Conflict check error:', error);
        throw error;
      }
      
      console.log('Conflict check result:', data);
      return data;
    },
  });

  return {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    checkConflicts,
  };
};

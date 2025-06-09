
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RosterAssignment } from '@/types/roster';
import { toast } from 'sonner';

export const useRosterAssignments = (tenantId: string) => {
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ['roster-assignments', tenantId],
    queryFn: async () => {
      console.log('Fetching roster assignments for tenant:', tenantId);
      
      // First get the roster assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('roster_assignments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: true });

      if (assignmentsError) {
        console.error('Error fetching roster assignments:', assignmentsError);
        throw assignmentsError;
      }

      console.log('Raw roster assignments data:', assignmentsData);

      if (!assignmentsData || assignmentsData.length === 0) {
        console.log('No roster assignments found');
        return [];
      }

      // Get all unique staff IDs
      const staffIds = [...new Set(assignmentsData.map(a => a.staff_id))];
      console.log('Staff IDs to fetch:', staffIds);

      // Fetch staff data separately
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, email, role')
        .in('id', staffIds);

      if (staffError) {
        console.error('Error fetching staff data:', staffError);
        throw staffError;
      }

      console.log('Staff data:', staffData);

      // Create a map for quick staff lookup
      const staffMap = new Map(staffData?.map(staff => [staff.id, staff]) || []);

      // Transform and combine the data
      const transformedAssignments = assignmentsData.map((record: any): RosterAssignment => {
        const assignment = {
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
          staff: staffMap.get(record.staff_id)
        };
        
        console.log('Transformed assignment:', assignment.id, {
          start: assignment.startTime,
          end: assignment.endTime,
          staff: assignment.staff?.name,
          type: assignment.assignmentType
        });
        
        return assignment;
      });

      console.log('Transformed roster assignments count:', transformedAssignments.length);
      return transformedAssignments;
    },
    enabled: !!tenantId,
  });

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

  console.log('useRosterAssignments hook state:', {
    tenantId,
    assignmentsCount: assignments.length,
    isLoading,
    hasError: !!error
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

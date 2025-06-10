
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RosterAssignment } from '@/types/roster';
import { transformRosterAssignmentData } from './rosterAssignmentUtils';

export const useRosterAssignmentQueries = (tenantId: string) => {
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

      // Transform and combine the data
      const transformedAssignments = transformRosterAssignmentData(assignmentsData, staffData || []);

      console.log('Transformed roster assignments count:', transformedAssignments.length);
      return transformedAssignments;
    },
    enabled: !!tenantId,
  });

  console.log('useRosterAssignmentQueries hook state:', {
    tenantId,
    assignmentsCount: assignments.length,
    isLoading,
    hasError: !!error
  });

  return {
    assignments,
    isLoading,
    error,
  };
};

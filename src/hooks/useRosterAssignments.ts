
import { useRosterAssignmentQueries } from './roster/useRosterAssignmentQueries';
import { useRosterAssignmentMutations } from './roster/useRosterAssignmentMutations';

export const useRosterAssignments = (tenantId: string) => {
  const { assignments, isLoading, error } = useRosterAssignmentQueries(tenantId);
  const { createAssignment, updateAssignment, deleteAssignment, checkConflicts } = useRosterAssignmentMutations({ tenantId });

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

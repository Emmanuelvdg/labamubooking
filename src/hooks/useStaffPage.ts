
import { useState } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { RosterAssignment } from '@/types/roster';

export const useStaffPage = () => {
  const { tenantId } = useTenant();
  const { data: staff, isLoading, error } = useStaff(tenantId || '');
  const { assignments } = useRosterAssignments(tenantId || '');
  const [selectedAssignment, setSelectedAssignment] = useState<RosterAssignment | null>(null);

  const handleAssignmentClick = (assignment: RosterAssignment) => {
    setSelectedAssignment(assignment);
    // TODO: Open assignment details dialog
  };

  return {
    tenantId: tenantId || '',
    staff,
    assignments,
    selectedAssignment,
    isLoading,
    error,
    handleAssignmentClick
  };
};

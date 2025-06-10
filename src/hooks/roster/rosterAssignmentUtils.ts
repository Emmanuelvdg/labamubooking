
import { RosterAssignment } from '@/types/roster';

export const transformRosterAssignmentData = (
  assignmentsData: any[],
  staffData: Array<{ id: string; name: string; email: string; role: string }>
): RosterAssignment[] => {
  // Create a map for quick staff lookup
  const staffMap = new Map(staffData.map(staff => [staff.id, staff]));

  return assignmentsData.map((record: any): RosterAssignment => {
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
};

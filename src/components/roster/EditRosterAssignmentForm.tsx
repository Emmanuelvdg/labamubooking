
import { RosterAssignment } from '@/types/roster';
import { RosterAssignmentFormFields } from './RosterAssignmentFormFields';
import { RosterAssignmentTimeFields } from './RosterAssignmentTimeFields';
import { useEditRosterAssignment } from '@/hooks/useEditRosterAssignment';

interface EditRosterAssignmentFormProps {
  assignment: RosterAssignment | null;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  onSuccess?: () => void;
  onClose: () => void;
}

export const EditRosterAssignmentForm = ({
  assignment,
  staff,
  onSuccess,
  onClose
}: EditRosterAssignmentFormProps) => {
  const {
    selectedStaff,
    setSelectedStaff,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    status,
    setStatus,
    assignmentType,
    setAssignmentType,
    notes,
    setNotes,
    handleSubmit,
    isSubmitting
  } = useEditRosterAssignment({ assignment, onSuccess, onClose });

  const activeStaff = staff.filter(member => member.isActive);

  if (!assignment) return null;

  return (
    <div className="space-y-4">
      <RosterAssignmentFormFields
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        status={status}
        setStatus={setStatus}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        notes={notes}
        setNotes={setNotes}
        activeStaff={activeStaff}
      />

      <RosterAssignmentTimeFields
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedStaff}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Assignment'}
        </button>
      </div>
    </div>
  );
};

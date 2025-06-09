
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { useTenant } from '@/contexts/TenantContext';
import { RosterAssignment } from '@/types/roster';
import { format } from 'date-fns';

interface DeleteRosterAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: RosterAssignment | null;
  onSuccess?: () => void;
}

export const DeleteRosterAssignmentDialog = ({
  open,
  onOpenChange,
  assignment,
  onSuccess
}: DeleteRosterAssignmentDialogProps) => {
  const { tenantId } = useTenant();
  const { deleteAssignment } = useRosterAssignments(tenantId || '');

  const handleDelete = async () => {
    if (!assignment) return;

    try {
      await deleteAssignment.mutateAsync(assignment.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  if (!assignment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Roster Assignment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this roster assignment?
            <br />
            <br />
            <strong>Staff:</strong> {assignment.staff?.name || 'Unknown'}
            <br />
            <strong>Time:</strong> {format(new Date(assignment.startTime), 'MMM d, yyyy HH:mm')} - {format(new Date(assignment.endTime), 'HH:mm')}
            <br />
            <strong>Type:</strong> {assignment.assignmentType}
            <br />
            <strong>Status:</strong> {assignment.status}
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteAssignment.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteAssignment.isPending ? 'Deleting...' : 'Delete Assignment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

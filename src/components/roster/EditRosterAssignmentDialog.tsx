
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RosterAssignment } from '@/types/roster';
import { EditRosterAssignmentForm } from './EditRosterAssignmentForm';

interface EditRosterAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: RosterAssignment | null;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  onSuccess?: () => void;
}

export const EditRosterAssignmentDialog = ({
  open,
  onOpenChange,
  assignment,
  staff,
  onSuccess
}: EditRosterAssignmentDialogProps) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Roster Assignment</DialogTitle>
        </DialogHeader>
        
        <EditRosterAssignmentForm
          assignment={assignment}
          staff={staff}
          onSuccess={onSuccess}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

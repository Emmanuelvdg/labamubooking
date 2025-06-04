
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
import { useDeleteStaff } from '@/hooks/useStaff';
import { Staff } from '@/types';

interface DeleteStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteStaffDialog = ({ staff, open, onOpenChange }: DeleteStaffDialogProps) => {
  const deleteStaff = useDeleteStaff();

  console.log('DeleteStaffDialog rendered with staff:', staff.name, 'open:', open);

  const handleDelete = async () => {
    console.log('Delete button clicked, attempting to delete staff:', staff.id);
    try {
      await deleteStaff.mutateAsync(staff.id);
      console.log('Staff deletion successful');
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {staff.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteStaff.isPending}
          >
            {deleteStaff.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

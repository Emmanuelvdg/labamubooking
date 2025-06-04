
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

  const handleDelete = async () => {
    await deleteStaff.mutateAsync(staff.id);
    onOpenChange(false);
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


import { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Service } from '@/types';
import { useDeleteService } from '@/hooks/useServices';

interface DeleteServiceDialogProps {
  service: Service;
}

export const DeleteServiceDialog = ({ service }: DeleteServiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const deleteService = useDeleteService();

  const handleDelete = async () => {
    try {
      await deleteService.mutateAsync(service.id);
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{service.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteService.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteService.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

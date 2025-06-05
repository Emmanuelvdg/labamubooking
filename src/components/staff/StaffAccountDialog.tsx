
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StaffAccountForm } from './StaffAccountForm';
import { Staff } from '@/types';

interface StaffAccountDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StaffAccountDialog = ({ staff, open, onOpenChange }: StaffAccountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Account Management</DialogTitle>
        </DialogHeader>
        <StaffAccountForm 
          staff={staff}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

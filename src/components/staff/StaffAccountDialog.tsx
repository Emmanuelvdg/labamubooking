
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { StaffAccountForm } from './StaffAccountForm';
import { Staff } from '@/types';

interface StaffAccountDialogProps {
  staff: Staff;
}

export const StaffAccountDialog = ({ staff }: StaffAccountDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCog className="h-4 w-4 mr-2" />
          Manage Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Account Management</DialogTitle>
        </DialogHeader>
        <StaffAccountForm 
          staff={staff}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};


import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StaffForm } from './StaffForm';
import { Staff } from '@/types';

interface EditStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStaffDialog = ({ staff, open, onOpenChange }: EditStaffDialogProps) => {
  console.log('EditStaffDialog rendered with staff:', staff.name, 'open:', open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update the information for {staff.name}.
          </DialogDescription>
        </DialogHeader>
        <StaffForm 
          initialData={staff}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};


import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BookingForm } from './BookingForm';

interface NewBookingDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactNode;
  initialData?: {
    startTime?: string;
    staffId?: string;
    notes?: string;
  };
}

export const NewBookingDialog = ({ open, onOpenChange, triggerButton, initialData }: NewBookingDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      New Booking
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!open && (
        <DialogTrigger asChild>
          {triggerButton || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <BookingForm onSuccess={() => setOpen(false)} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};

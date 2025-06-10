
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdHocScheduleForm } from './AdHocScheduleForm';

interface AdHocScheduleDialogProps {
  selectedDate?: Date;
  selectedStaffId?: string;
  triggerButton?: React.ReactNode;
}

export const AdHocScheduleDialog = ({ 
  selectedDate, 
  selectedStaffId, 
  triggerButton 
}: AdHocScheduleDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Ad-Hoc Schedule</DialogTitle>
        </DialogHeader>
        <AdHocScheduleForm 
          onSuccess={handleSuccess}
          selectedDate={selectedDate}
          selectedStaffId={selectedStaffId}
        />
      </DialogContent>
    </Dialog>
  );
};

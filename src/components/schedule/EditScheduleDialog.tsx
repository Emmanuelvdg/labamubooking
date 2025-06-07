
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScheduleForm } from './ScheduleForm';
import { StaffSchedule } from '@/types/schedule';

interface EditScheduleDialogProps {
  schedule: StaffSchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditScheduleDialog = ({ schedule, open, onOpenChange }: EditScheduleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        <ScheduleForm 
          initialData={schedule}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

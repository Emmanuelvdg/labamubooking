
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';

interface CalendarHeaderProps {
  onAddAppointment?: () => void;
}

export const CalendarHeader = ({ onAddAppointment }: CalendarHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">View and manage your appointment schedule</p>
      </div>
      <NewBookingDialog 
        triggerButton={
          <Button onClick={onAddAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        }
      />
    </div>
  );
};

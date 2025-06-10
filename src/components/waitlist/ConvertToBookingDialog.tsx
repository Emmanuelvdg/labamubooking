
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { WaitlistEntry } from '@/types/waitlist';
import { format } from 'date-fns';

interface ConvertToBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistEntry: WaitlistEntry;
  onConvert: (bookingData: any) => void;
  isLoading?: boolean;
}

export const ConvertToBookingDialog = ({
  open,
  onOpenChange,
  waitlistEntry,
  onConvert,
  isLoading
}: ConvertToBookingDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime) {
      return;
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + (waitlistEntry.service?.duration || 60));

    onConvert({
      customer_id: waitlistEntry.customer_id,
      service_id: waitlistEntry.service_id,
      staff_id: waitlistEntry.preferred_staff_id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      notes: waitlistEntry.notes
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convert to Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-medium">{waitlistEntry.customer?.name}</div>
            <div className="text-sm text-gray-600">{waitlistEntry.service?.name}</div>
            {waitlistEntry.preferred_staff && (
              <div className="text-sm text-gray-600">
                Prefers: {waitlistEntry.preferred_staff.name}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedDate || !startTime || isLoading}>
                {isLoading ? 'Converting...' : 'Create Booking'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

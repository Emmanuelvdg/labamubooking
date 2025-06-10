
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BookingDetailsProps {
  startTime: string;
  notes: string;
  onStartTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const BookingDetails = ({ startTime, notes, onStartTimeChange, onNotesChange }: BookingDetailsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Date & Time</Label>
        <Input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          required
        />
        <div className="text-xs text-gray-500">
          Services will be scheduled sequentially starting from this time
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any special notes for this booking..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </>
  );
};


import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare } from 'lucide-react';
import { TimeSlotPicker } from './TimeSlotPicker';

interface BookingDetailsProps {
  startTime: string;
  notes: string;
  onStartTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const BookingDetails = ({ startTime, notes, onStartTimeChange, onNotesChange }: BookingDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <Label className="font-medium">Start Date & Time</Label>
            </div>
            <TimeSlotPicker
              selectedDateTime={startTime}
              onDateTimeSelect={onStartTimeChange}
            />
            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              ℹ️ Services will be scheduled sequentially starting from this time
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <Label htmlFor="notes" className="font-medium">Notes (Optional)</Label>
            </div>
            <Textarea
              id="notes"
              placeholder="Add any special notes, requests, or instructions for this booking..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RosterAssignmentTimeFieldsProps {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
}

export const RosterAssignmentTimeFields = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime
}: RosterAssignmentTimeFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input 
            type="time" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input 
            type="time" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)} 
          />
        </div>
      </div>
    </>
  );
};

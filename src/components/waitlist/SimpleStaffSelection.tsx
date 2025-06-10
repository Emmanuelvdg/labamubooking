
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '@/types';

interface SimpleStaffSelectionProps {
  selectedStaffId: string;
  onStaffSelect: (staffId: string) => void;
  staff?: Staff[];
}

export const SimpleStaffSelection = ({ selectedStaffId, onStaffSelect, staff }: SimpleStaffSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="staff">Preferred Staff (Optional)</Label>
      <Select value={selectedStaffId} onValueChange={onStaffSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Any available staff" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Any available staff</SelectItem>
          {staff?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

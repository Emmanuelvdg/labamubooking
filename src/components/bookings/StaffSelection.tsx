
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '@/types';

interface StaffSelectionProps {
  value: string;
  onValueChange: (value: string) => void;
  staff?: Staff[];
}

export const StaffSelection = ({ value, onValueChange, staff }: StaffSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="staff">Staff Member</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select staff" />
        </SelectTrigger>
        <SelectContent>
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

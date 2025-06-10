
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RosterAssignmentFormFieldsProps {
  selectedStaff: string;
  setSelectedStaff: (value: string) => void;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  setStatus: (value: 'scheduled' | 'confirmed' | 'cancelled' | 'completed') => void;
  assignmentType: 'regular' | 'template' | 'overtime' | 'emergency';
  setAssignmentType: (value: 'regular' | 'template' | 'overtime' | 'emergency') => void;
  notes: string;
  setNotes: (value: string) => void;
  activeStaff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
}

export const RosterAssignmentFormFields = ({
  selectedStaff,
  setSelectedStaff,
  status,
  setStatus,
  assignmentType,
  setAssignmentType,
  notes,
  setNotes,
  activeStaff
}: RosterAssignmentFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Staff Member</Label>
        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
          <SelectTrigger>
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {activeStaff.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(value: any) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Assignment Type</Label>
        <Select value={assignmentType} onValueChange={(value: any) => setAssignmentType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="template">Template</SelectItem>
            <SelectItem value="overtime">Overtime</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>
    </>
  );
};

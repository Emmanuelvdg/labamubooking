
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { useTenant } from '@/contexts/TenantContext';
import { format } from 'date-fns';
import { RosterAssignment } from '@/types/roster';
import { toast } from 'sonner';

interface EditRosterAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: RosterAssignment | null;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  onSuccess?: () => void;
}

export const EditRosterAssignmentDialog = ({
  open,
  onOpenChange,
  assignment,
  staff,
  onSuccess
}: EditRosterAssignmentDialogProps) => {
  const { tenantId } = useTenant();
  const { updateAssignment } = useRosterAssignments(tenantId || '');
  
  const [selectedStaff, setSelectedStaff] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'confirmed' | 'cancelled' | 'completed'>('scheduled');
  const [assignmentType, setAssignmentType] = useState<'regular' | 'template' | 'overtime' | 'emergency'>('regular');
  const [notes, setNotes] = useState('');

  // Reset form when assignment changes
  useEffect(() => {
    if (assignment) {
      setSelectedStaff(assignment.staffId);
      const startDateTime = new Date(assignment.startTime);
      const endDateTime = new Date(assignment.endTime);
      
      setStartDate(format(startDateTime, 'yyyy-MM-dd'));
      setStartTime(format(startDateTime, 'HH:mm'));
      setEndDate(format(endDateTime, 'yyyy-MM-dd'));
      setEndTime(format(endDateTime, 'HH:mm'));
      setStatus(assignment.status);
      setAssignmentType(assignment.assignmentType);
      setNotes(assignment.notes || '');
    }
  }, [assignment]);

  const handleSubmit = async () => {
    if (!assignment || !selectedStaff || !tenantId) {
      toast.error('Missing required information');
      return;
    }

    try {
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      await updateAssignment.mutateAsync({
        id: assignment.id,
        staffId: selectedStaff,
        startTime: startDateTime,
        endTime: endDateTime,
        status,
        assignmentType,
        notes: notes || undefined
      });

      toast.success('Roster assignment updated successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update roster assignment');
    }
  };

  const activeStaff = staff.filter(member => member.isActive);

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Roster Assignment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={updateAssignment.isPending || !selectedStaff}
          >
            {updateAssignment.isPending ? 'Updating...' : 'Update Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

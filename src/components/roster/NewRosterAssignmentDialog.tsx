
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { useTenant } from '@/contexts/TenantContext';
import { format } from 'date-fns';
import { RosterAssignment } from '@/types/roster';

interface NewRosterAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  selectedDate?: Date | null;
  selectedStaffId?: string | null;
}

export const NewRosterAssignmentDialog = ({
  open,
  onOpenChange,
  staff,
  selectedDate,
  selectedStaffId
}: NewRosterAssignmentDialogProps) => {
  const { tenantId } = useTenant();
  const { createAssignment, checkConflicts } = useRosterAssignments(tenantId || '');

  const [formData, setFormData] = useState({
    staffId: selectedStaffId || '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    assignmentType: 'regular' as RosterAssignment['assignmentType'],
    status: 'scheduled' as RosterAssignment['status'],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) return;

    const startTime = `${formData.date}T${formData.startTime}:00`;
    const endTime = `${formData.date}T${formData.endTime}:00`;

    // Check for conflicts first
    try {
      const conflicts = await checkConflicts.mutateAsync({
        staffId: formData.staffId,
        startTime,
        endTime
      });

      if (conflicts && conflicts.length > 0) {
        const errorConflicts = conflicts.filter((c: any) => c.severity === 'error');
        if (errorConflicts.length > 0) {
          alert(`Cannot create assignment: ${errorConflicts[0].message}`);
          return;
        }
      }

      await createAssignment.mutateAsync({
        tenantId,
        staffId: formData.staffId,
        startTime,
        endTime,
        assignmentType: formData.assignmentType,
        status: formData.status,
        notes: formData.notes || undefined
      });

      onOpenChange(false);
      setFormData({
        staffId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '17:00',
        assignmentType: 'regular',
        status: 'scheduled',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const activeStaff = staff.filter(member => member.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Roster Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffId">Staff Member</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) => setFormData({ ...formData, staffId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {activeStaff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentType">Assignment Type</Label>
            <Select
              value={formData.assignmentType}
              onValueChange={(value: RosterAssignment['assignmentType']) => 
                setFormData({ ...formData, assignmentType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="template">From Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: RosterAssignment['status']) => 
                setFormData({ ...formData, status: value })
              }
            >
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
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAssignment.isPending || !formData.staffId}
            >
              {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

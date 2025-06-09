import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { useTenant } from '@/contexts/TenantContext';
import { format, addDays } from 'date-fns';
import { RosterAssignment } from '@/types/roster';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface NewRosterAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  selectedDate?: Date | null;
  selectedStaffId?: string | null;
  onSuccess?: () => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  shifts: TimeSlot[];
}

interface ScheduleData {
  [key: string]: DaySchedule;
}

const DAYS_OF_WEEK = [{
  key: 'monday',
  label: 'Monday'
}, {
  key: 'tuesday',
  label: 'Tuesday'
}, {
  key: 'wednesday',
  label: 'Wednesday'
}, {
  key: 'thursday',
  label: 'Thursday'
}, {
  key: 'friday',
  label: 'Friday'
}, {
  key: 'saturday',
  label: 'Saturday'
}, {
  key: 'sunday',
  label: 'Sunday'
}];

// Generate time options in 15-minute increments
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

export const NewRosterAssignmentDialog = ({
  open,
  onOpenChange,
  staff,
  selectedDate,
  selectedStaffId,
  onSuccess
}: NewRosterAssignmentDialogProps) => {
  const {
    tenantId
  } = useTenant();
  const {
    createAssignment
  } = useRosterAssignments(tenantId || '');
  const [selectedStaff, setSelectedStaff] = useState(selectedStaffId || '');
  const [scheduleType, setScheduleType] = useState('every-week');
  const [startDate, setStartDate] = useState(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('never');
  const [notes, setNotes] = useState('');
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    monday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '19:00'
      }]
    },
    tuesday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '19:00'
      }]
    },
    wednesday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '19:00'
      }]
    },
    thursday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '19:00'
      }]
    },
    friday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '19:00'
      }]
    },
    saturday: {
      enabled: false,
      shifts: [{
        startTime: '10:00',
        endTime: '17:00'
      }]
    },
    sunday: {
      enabled: false,
      shifts: []
    }
  });

  const calculateDuration = (shifts: TimeSlot[]): string => {
    const totalMinutes = shifts.reduce((total, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}:00`);
      const end = new Date(`2000-01-01T${shift.endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      return total + Math.floor(diffMs / (1000 * 60));
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
  };

  const updateShift = (day: string, shiftIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: prev[day].shifts.map((shift, index) => index === shiftIndex ? {
          ...shift,
          [field]: value
        } : shift)
      }
    }));
  };

  const addShift = (day: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: [...prev[day].shifts, {
          startTime: '10:00',
          endTime: '19:00'
        }]
      }
    }));
  };

  const removeShift = (day: string, shiftIndex: number) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: prev[day].shifts.filter((_, index) => index !== shiftIndex)
      }
    }));
  };

  const toggleDay = (day: string, enabled: boolean) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled
      }
    }));
  };

  const hasOverlappingShifts = (shifts: TimeSlot[]): boolean => {
    if (shifts.length <= 1) return false;
    for (let i = 0; i < shifts.length; i++) {
      for (let j = i + 1; j < shifts.length; j++) {
        const start1 = new Date(`2000-01-01T${shifts[i].startTime}:00`);
        const end1 = new Date(`2000-01-01T${shifts[i].endTime}:00`);
        const start2 = new Date(`2000-01-01T${shifts[j].startTime}:00`);
        const end2 = new Date(`2000-01-01T${shifts[j].endTime}:00`);
        if (start1 < end2 && start2 < end1) {
          return true;
        }
      }
    }
    return false;
  };

  const resetForm = () => {
    setSelectedStaff('');
    setScheduleData({
      monday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '19:00' }] },
      tuesday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '19:00' }] },
      wednesday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '19:00' }] },
      thursday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '19:00' }] },
      friday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '19:00' }] },
      saturday: { enabled: false, shifts: [{ startTime: '10:00', endTime: '17:00' }] },
      sunday: { enabled: false, shifts: [] }
    });
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!selectedStaff || !tenantId) {
      toast.error('Please select a staff member');
      return;
    }

    try {
      let assignmentsCreated = 0;

      // Create assignments for each enabled day with shifts
      for (const day of DAYS_OF_WEEK) {
        const dayData = scheduleData[day.key];
        if (dayData.enabled && dayData.shifts.length > 0) {
          for (const shift of dayData.shifts) {
            const assignmentDate = format(new Date(startDate), 'yyyy-MM-dd');
            const startTime = `${assignmentDate}T${shift.startTime}:00`;
            const endTime = `${assignmentDate}T${shift.endTime}:00`;
            
            await createAssignment.mutateAsync({
              tenantId,
              staffId: selectedStaff,
              startTime,
              endTime,
              assignmentType: 'regular',
              status: 'scheduled',
              notes: notes || undefined
            });
            assignmentsCreated++;
          }
        }
      }

      if (assignmentsCreated > 0) {
        toast.success(`Created ${assignmentsCreated} roster assignment${assignmentsCreated > 1 ? 's' : ''}`);
        onSuccess?.();
        resetForm();
      } else {
        toast.error('Please enable at least one day with shifts');
      }
    } catch (error) {
      console.error('Error creating assignments:', error);
      toast.error('Failed to create roster assignments');
    }
  };

  const activeStaff = staff.filter(member => member.isActive);

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Roster Assignment</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Staff Member</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {activeStaff.map(member => <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule type</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every-week">Every week</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Ends</Label>
              <Select value={endDate} onValueChange={setEndDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="custom">Custom date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any additional notes..." rows={3} />
            </div>
          </div>

          {/* Right Panel - Schedule Grid */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg p-6 space-y-4">
              {DAYS_OF_WEEK.map(day => {
              const dayData = scheduleData[day.key];
              const hasOverlap = hasOverlappingShifts(dayData.shifts);
              const duration = dayData.enabled ? calculateDuration(dayData.shifts) : '0h';
              return <div key={day.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={dayData.enabled} onCheckedChange={checked => toggleDay(day.key, !!checked)} />
                        <div>
                          <div className="font-medium">{day.label}</div>
                          <div className="text-sm text-gray-500">{duration}</div>
                        </div>
                      </div>
                      
                      {dayData.enabled && <div className="flex flex-col space-y-2">
                          {dayData.shifts.length === 0 ? <div className="text-gray-500 text-sm">No shifts</div> : dayData.shifts.map((shift, shiftIndex) => <div key={shiftIndex} className="flex items-center space-x-2">
                                <Select value={shift.startTime} onValueChange={value => updateShift(day.key, shiftIndex, 'startTime', value)}>
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_OPTIONS.map(time => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <span>-</span>
                                
                                <Select value={shift.endTime} onValueChange={value => updateShift(day.key, shiftIndex, 'endTime', value)}>
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_OPTIONS.map(time => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {dayData.shifts.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeShift(day.key, shiftIndex)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>}
                              </div>)}
                          
                          <Button variant="ghost" size="sm" onClick={() => addShift(day.key)} className="text-blue-600 hover:text-blue-700 self-start">
                            Add a shift
                          </Button>
                        </div>}
                      
                      {!dayData.enabled && <div className="text-gray-500 text-sm">No shifts</div>}
                    </div>
                    
                    {hasOverlap && dayData.enabled && <div className="text-sm text-red-600 ml-8">
                        Shift is overlapping
                      </div>}
                  </div>;
            })}
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createAssignment.isPending || !selectedStaff}>
                {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};

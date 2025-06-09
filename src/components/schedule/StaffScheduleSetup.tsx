
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { useCreateSchedule } from '@/hooks/useStaffSchedules';
import { useTenant } from '@/contexts/TenantContext';
import { format, addDays } from 'date-fns';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  duration: string;
  shifts: TimeSlot[];
}

interface ScheduleSetupData {
  [key: string]: DaySchedule;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

interface StaffScheduleSetupProps {
  onSuccess?: () => void;
}

export const StaffScheduleSetup = ({ onSuccess }: StaffScheduleSetupProps) => {
  const { tenantId } = useTenant();
  const { data: staff } = useStaff(tenantId || '');
  const createSchedule = useCreateSchedule();

  const [selectedStaff, setSelectedStaff] = useState('');
  const [scheduleType, setScheduleType] = useState('every-week');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('never');

  const [scheduleData, setScheduleData] = useState<ScheduleSetupData>({
    monday: { enabled: false, duration: '9h', shifts: [{ startTime: '10:00', endTime: '19:00' }] },
    tuesday: { enabled: false, duration: '9h', shifts: [{ startTime: '10:00', endTime: '19:00' }] },
    wednesday: { enabled: false, duration: '9h', shifts: [{ startTime: '10:00', endTime: '19:00' }] },
    thursday: { enabled: false, duration: '9h', shifts: [{ startTime: '10:00', endTime: '19:00' }] },
    friday: { enabled: false, duration: '9h', shifts: [{ startTime: '10:00', endTime: '19:00' }] },
    saturday: { enabled: false, duration: '7h', shifts: [{ startTime: '10:00', endTime: '17:00' }] },
    sunday: { enabled: false, duration: '0h', shifts: [] },
  });

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMinutes === 0) {
      return `${diffHours}h`;
    }
    return `${diffHours}h ${diffMinutes}min`;
  };

  const updateShift = (day: string, shiftIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setScheduleData(prev => {
      const updated = { ...prev };
      updated[day].shifts[shiftIndex][field] = value;
      
      // Recalculate total duration for the day
      const totalMinutes = updated[day].shifts.reduce((total, shift) => {
        const start = new Date(`2000-01-01T${shift.startTime}:00`);
        const end = new Date(`2000-01-01T${shift.endTime}:00`);
        const diffMs = end.getTime() - start.getTime();
        return total + Math.floor(diffMs / (1000 * 60));
      }, 0);
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      updated[day].duration = minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
      
      return updated;
    });
  };

  const addShift = (day: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: [...prev[day].shifts, { startTime: '10:00', endTime: '19:00' }]
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
      [day]: { ...prev[day], enabled }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedStaff || !tenantId) return;

    // Create schedules for each enabled day
    for (const day of DAYS_OF_WEEK) {
      const dayData = scheduleData[day.key];
      if (dayData.enabled && dayData.shifts.length > 0) {
        for (const shift of dayData.shifts) {
          // Create a schedule for this day and shift
          const schedulePayload = {
            tenantId,
            staffId: selectedStaff,
            title: `${day.label} Shift`,
            description: `Regular ${day.label} schedule`,
            startTime: new Date(`${startDate}T${shift.startTime}:00`).toISOString(),
            endTime: new Date(`${startDate}T${shift.endTime}:00`).toISOString(),
            isRecurring: true,
            repeatType: 'weekly' as const,
            repeatInterval: 1,
            weeklyPattern: [day.key] as any,
            repeatEndDate: endDate === 'never' ? undefined : new Date(`${endDate}T23:59:59`).toISOString(),
          };

          await createSchedule.mutateAsync(schedulePayload);
        }
      }
    }

    onSuccess?.();
  };

  const selectedStaffMember = staff?.find(s => s.id === selectedStaff);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Set {selectedStaffMember?.name || 'staff member'}'s regular shifts
        </h2>
        <p className="text-gray-600">
          Set weekly, biweekly or custom shifts. Changes saved will apply to all upcoming shifts for the selected period.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Staff Member</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
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

              <div className="space-y-2">
                <Label>Schedule type</Label>
                <Select value={scheduleType} onValueChange={setScheduleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every-week">Every week</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
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
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <p className="text-sm text-blue-800">
                Team members will not be scheduled on business closed periods.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Schedule Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const dayData = scheduleData[day.key];
                  const hasOverlap = dayData.shifts.length > 1;
                  
                  return (
                    <div key={day.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={dayData.enabled}
                            onCheckedChange={(checked) => toggleDay(day.key, !!checked)}
                          />
                          <div>
                            <div className="font-medium">{day.label}</div>
                            <div className="text-sm text-gray-500">{dayData.duration}</div>
                          </div>
                        </div>
                        
                        {dayData.enabled && (
                          <div className="flex items-center space-x-2">
                            {dayData.shifts.length === 0 ? (
                              <div className="text-gray-500 text-sm">No shifts</div>
                            ) : (
                              dayData.shifts.map((shift, shiftIndex) => (
                                <div key={shiftIndex} className="flex items-center space-x-2">
                                  <Select 
                                    value={shift.startTime} 
                                    onValueChange={(value) => updateShift(day.key, shiftIndex, 'startTime', value)}
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 24 }, (_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return (
                                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                            {hour}:00
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  
                                  <span>-</span>
                                  
                                  <Select 
                                    value={shift.endTime} 
                                    onValueChange={(value) => updateShift(day.key, shiftIndex, 'endTime', value)}
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 24 }, (_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return (
                                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                            {hour}:00
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  
                                  {dayData.shifts.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeShift(day.key, shiftIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addShift(day.key)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Add a shift
                            </Button>
                          </div>
                        )}
                        
                        {!dayData.enabled && (
                          <div className="text-gray-500 text-sm">No shifts</div>
                        )}
                      </div>
                      
                      {hasOverlap && dayData.enabled && (
                        <div className="text-sm text-red-600 ml-8">
                          Shift is overlapping
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedStaff || createSchedule.isPending}
                >
                  {createSchedule.isPending ? 'Saving...' : 'Save Schedule'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

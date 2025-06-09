
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStaff } from '@/hooks/useStaff';
import { useCreateSchedule, useUpdateSchedule } from '@/hooks/useStaffSchedules';
import { useTenant } from '@/contexts/TenantContext';
import { StaffSchedule, DayOfWeek } from '@/types/schedule';

interface ScheduleFormProps {
  onSuccess?: () => void;
  initialData?: StaffSchedule;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

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

export const ScheduleForm = ({ onSuccess, initialData }: ScheduleFormProps) => {
  const [formData, setFormData] = useState({
    staffId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    repeatType: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    repeatInterval: 1,
    repeatEndDate: '',
    repeatCount: '',
    weeklyPattern: [] as DayOfWeek[],
  });

  const { tenantId } = useTenant();
  const { data: staff } = useStaff(tenantId || '');
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        staffId: initialData.staffId,
        title: initialData.title,
        description: initialData.description || '',
        startTime: initialData.startTime.slice(0, 16), // Format for datetime-local
        endTime: initialData.endTime.slice(0, 16),
        isRecurring: initialData.isRecurring,
        repeatType: initialData.repeatType,
        repeatInterval: initialData.repeatInterval || 1,
        repeatEndDate: initialData.repeatEndDate?.slice(0, 16) || '',
        repeatCount: initialData.repeatCount?.toString() || '',
        weeklyPattern: initialData.weeklyPattern || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId || !formData.staffId || !formData.title || !formData.startTime || !formData.endTime) {
      return;
    }

    const scheduleData = {
      tenantId,
      staffId: formData.staffId,
      title: formData.title,
      description: formData.description || undefined,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      isRecurring: formData.isRecurring,
      repeatType: formData.repeatType,
      repeatInterval: formData.isRecurring ? formData.repeatInterval : undefined,
      repeatEndDate: formData.repeatEndDate ? new Date(formData.repeatEndDate).toISOString() : undefined,
      repeatCount: formData.repeatCount ? parseInt(formData.repeatCount) : undefined,
      weeklyPattern: formData.repeatType === 'weekly' ? formData.weeklyPattern : undefined,
    };

    try {
      if (isEditing && initialData) {
        await updateSchedule.mutateAsync({
          ...initialData,
          ...scheduleData,
        });
      } else {
        await createSchedule.mutateAsync(scheduleData);
      }

      onSuccess?.();
      if (!isEditing) {
        setFormData({
          staffId: '',
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          isRecurring: false,
          repeatType: 'none',
          repeatInterval: 1,
          repeatEndDate: '',
          repeatCount: '',
          weeklyPattern: [],
        });
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleWeeklyPatternChange = (day: DayOfWeek, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      weeklyPattern: checked
        ? [...prev.weeklyPattern, day]
        : prev.weeklyPattern.filter(d => d !== day)
    }));
  };

  const isPending = createSchedule.isPending || updateSchedule.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="staff">Staff Member</Label>
          <Select 
            value={formData.staffId} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value }))}
          >
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Morning Shift, Weekend Coverage"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            required
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recurring Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  isRecurring: !!checked,
                  repeatType: checked ? 'weekly' : 'none'
                }))
              }
            />
            <Label htmlFor="isRecurring">Make this a recurring schedule</Label>
          </div>

          {formData.isRecurring && (
            <>
              <div className="space-y-2">
                <Label>Repeat Type</Label>
                <Select 
                  value={formData.repeatType} 
                  onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => 
                    setFormData(prev => ({ ...prev, repeatType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.repeatType === 'weekly' && (
                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-1">
                        <Checkbox
                          id={day.value}
                          checked={formData.weeklyPattern.includes(day.value)}
                          onCheckedChange={(checked) => 
                            handleWeeklyPatternChange(day.value, !!checked)
                          }
                        />
                        <Label htmlFor={day.value} className="text-xs">
                          {day.label.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repeatEndDate">End Date (Optional)</Label>
                  <Input
                    id="repeatEndDate"
                    type="datetime-local"
                    value={formData.repeatEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, repeatEndDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeatCount">Max Occurrences (Optional)</Label>
                  <Input
                    id="repeatCount"
                    type="number"
                    value={formData.repeatCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, repeatCount: e.target.value }))}
                    placeholder="e.g., 10"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Schedule' : 'Create Schedule')}
        </Button>
      </div>
    </form>
  );
};

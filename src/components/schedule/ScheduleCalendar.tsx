
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useScheduleInstances } from '@/hooks/useStaffSchedules';
import { useTenant } from '@/contexts/TenantContext';
import { ScheduleInstance } from '@/types/schedule';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay } from 'date-fns';

interface ScheduleCalendarProps {
  onCreateSchedule?: () => void;
}

export const ScheduleCalendar = ({ onCreateSchedule }: ScheduleCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { tenantId } = useTenant();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: scheduleInstances, isLoading, error } = useScheduleInstances(
    tenantId || '',
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );

  console.log('Calendar - Schedule instances:', scheduleInstances);
  console.log('Calendar - Is loading:', isLoading);
  console.log('Calendar - Error:', error);

  const getSchedulesForDay = (date: Date): ScheduleInstance[] => {
    if (!scheduleInstances) return [];
    const daySchedules = scheduleInstances.filter(instance => 
      isSameDay(new Date(instance.instanceDate), date)
    );
    console.log(`Schedules for ${format(date, 'yyyy-MM-dd')}:`, daySchedules);
    return daySchedules;
  };

  const previousWeek = () => setCurrentWeek(prev => subWeeks(prev, 1));
  const nextWeek = () => setCurrentWeek(prev => addWeeks(prev, 1));

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return timeString;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading calendar...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading calendar: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Staff Schedule Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button onClick={previousWeek} variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
            <Button onClick={nextWeek} variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {onCreateSchedule && (
              <Button onClick={onCreateSchedule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-gray-600">
          Total schedule instances this week: {scheduleInstances?.length || 0}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={day.toISOString()} className="min-h-[200px]">
                <div className={`text-center p-2 rounded-t-lg border-b ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-xs text-gray-600">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                <div className="p-2 space-y-1 min-h-[150px] border-l border-r border-b border-gray-200 rounded-b-lg">
                  {daySchedules.map((schedule, index) => (
                    <div
                      key={`${schedule.staffId}-${index}`}
                      className={`text-xs p-2 rounded-md border-l-4 ${
                        schedule.hasException 
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                          : 'bg-blue-50 border-blue-400 text-blue-800'
                      }`}
                    >
                      <div className="font-medium truncate">{schedule.title}</div>
                      <div className="text-xs">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                      {schedule.hasException && (
                        <div className="text-xs text-yellow-600 mt-1">
                          Modified
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {daySchedules.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-4">
                      No schedules
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

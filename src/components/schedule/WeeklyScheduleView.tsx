
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Settings, Plus } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useScheduleInstances } from '@/hooks/useStaffSchedules';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { ScheduleInstance } from '@/types/schedule';

interface WeeklyScheduleViewProps {
  onAddSchedule?: () => void;
  onOptionsClick?: () => void;
}

export const WeeklyScheduleView = ({ onAddSchedule, onOptionsClick }: WeeklyScheduleViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { tenantId } = useTenant();
  const { data: staff } = useStaff(tenantId || '');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: scheduleInstances, isLoading } = useScheduleInstances(
    tenantId || '',
    format(weekStart, 'yyyy-MM-dd'),
    format(addDays(weekStart, 6), 'yyyy-MM-dd')
  );

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const getSchedulesForStaffAndDay = (staffId: string, date: Date): ScheduleInstance[] => {
    if (!scheduleInstances) return [];
    return scheduleInstances.filter(instance => 
      instance.staffId === staffId && isSameDay(new Date(instance.instanceDate), date)
    );
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return timeString;
    }
  };

  const getDayName = (date: Date) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[date.getDay()];
  };

  const getStaffColor = (staffId: string) => {
    // Generate consistent colors for staff members
    const colors = [
      'bg-blue-100 border-blue-200',
      'bg-yellow-100 border-yellow-200',
      'bg-green-100 border-green-200',
      'bg-purple-100 border-purple-200',
      'bg-pink-100 border-pink-200',
      'bg-indigo-100 border-indigo-200',
    ];
    
    const index = staff?.findIndex(s => s.id === staffId) || 0;
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading schedule...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Scheduled shifts</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onOptionsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Options
          </Button>
          <Button size="sm" onClick={onAddSchedule}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            This week
          </div>
          <Button variant="ghost" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {format(weekStart, 'd')} - {format(addDays(weekStart, 6), 'd MMM, yyyy')}
        </div>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 w-48">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Team member</span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Change
                      </Button>
                    </div>
                  </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="text-center p-4 min-w-48">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {getDayName(day)}, {format(day, 'd MMM')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {index < 5 ? '18h' : index === 5 ? '14h' : '0min'}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff?.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day, dayIndex) => {
                      const daySchedules = getSchedulesForStaffAndDay(member.id, day);
                      
                      return (
                        <td key={dayIndex} className="p-4 align-top">
                          <div className="space-y-2">
                            {daySchedules.map((schedule, scheduleIndex) => (
                              <div
                                key={scheduleIndex}
                                className={`p-2 rounded border text-sm ${getStaffColor(member.id)}`}
                              >
                                <div className="font-medium">
                                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                </div>
                                {schedule.hasException && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    Modified
                                  </Badge>
                                )}
                              </div>
                            ))}
                            {daySchedules.length === 0 && (
                              <div className="h-8 flex items-center justify-center text-gray-400 text-xs">
                                -
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          </div>
          <p className="text-sm text-blue-800">
            The team roster shows your availability for bookings and is not linked to your business opening hours. 
            To set your opening hours, <button className="underline">click here</button>.
          </p>
        </div>
      </div>
    </div>
  );
};

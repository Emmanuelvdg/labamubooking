
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Settings, Plus } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { useCalendarData } from '@/hooks/useCalendarData';
import { AdHocScheduleDialog } from './AdHocScheduleDialog';

interface WeeklyScheduleViewProps {
  onAddSchedule?: () => void;
  onOptionsClick?: () => void;
}

export const WeeklyScheduleView = ({
  onAddSchedule,
  onOptionsClick
}: WeeklyScheduleViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { tenantId } = useTenant();
  const { data: staff } = useStaff(tenantId || '');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Use unified calendar data instead of just schedule instances
  const { data: calendarEvents, isLoading } = useCalendarData(
    tenantId || '',
    weekStart,
    weekEnd
  );

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const getEventsForStaffAndDay = (staffId: string, date: Date) => {
    if (!calendarEvents) return [];
    
    return calendarEvents.filter(event => {
      if (event.staffId !== staffId) return false;
      
      // For schedule events, use exact date match
      if (event.type === 'schedule') {
        return isSameDay(new Date(event.startTime), date);
      }
      
      // For roster events, check if date falls within the assignment period
      if (event.type === 'roster') {
        const eventStartDate = new Date(event.startTime);
        const eventEndDate = new Date(event.endTime);
        
        if (isSameDay(eventStartDate, eventEndDate)) {
          return isSameDay(eventStartDate, date);
        }
        
        // Multi-day assignment
        return date >= eventStartDate && date <= eventEndDate;
      }
      
      return false;
    });
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

  const getEventColor = (event: any) => {
    if (event.type === 'roster') {
      switch (event.status) {
        case 'confirmed': return 'bg-green-100 border-green-200 text-green-800';
        case 'scheduled': return 'bg-blue-100 border-blue-200 text-blue-800';
        case 'cancelled': return 'bg-red-100 border-red-200 text-red-800';
        case 'completed': return 'bg-gray-100 border-gray-200 text-gray-800';
        default: return 'bg-gray-100 border-gray-200 text-gray-800';
      }
    } else {
      // Schedule events
      return event.hasException 
        ? 'bg-yellow-100 border-yellow-200 text-yellow-800'
        : 'bg-purple-100 border-purple-200 text-purple-800';
    }
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

  const totalEvents = calendarEvents?.length || 0;
  const rosterEvents = calendarEvents?.filter(e => e.type === 'roster').length || 0;
  const scheduleEvents = calendarEvents?.filter(e => e.type === 'schedule').length || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Staff Schedules & Roster</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onOptionsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Options
          </Button>
          <AdHocScheduleDialog 
            triggerButton={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            }
          />
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
          {format(weekStart, 'd')} - {format(addDays(weekStart, 6), 'd MMM, yyyy')} • 
          {totalEvents} events ({scheduleEvents} scheduled, {rosterEvents} roster)
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
                    </div>
                  </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="text-center p-4 min-w-48">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {getDayName(day)}, {format(day, 'd MMM')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getEventsForStaffAndDay('all', day).length} events
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff?.map(member => (
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
                      const dayEvents = getEventsForStaffAndDay(member.id, day);
                      return (
                        <td key={dayIndex} className="p-4 align-top">
                          <div className="space-y-2">
                            {dayEvents.map((event, eventIndex) => (
                              <div key={eventIndex} className={`p-2 rounded border text-sm ${getEventColor(event)}`}>
                                <div className="font-medium">
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                <div className="text-xs opacity-75 truncate">{event.title}</div>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {event.type}
                                  </Badge>
                                  {event.hasException && (
                                    <Badge variant="outline" className="text-xs text-yellow-600">
                                      Modified
                                    </Badge>
                                  )}
                                  {event.status && (
                                    <Badge variant="outline" className="text-xs">
                                      {event.status}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                            {dayEvents.length === 0 && (
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
    </div>
  );
};

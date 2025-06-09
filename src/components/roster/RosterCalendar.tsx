
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { RosterAssignment } from '@/types/roster';
import { NewRosterAssignmentDialog } from './NewRosterAssignmentDialog';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useQueryClient } from '@tanstack/react-query';
import { useTenant } from '@/contexts/TenantContext';

interface RosterCalendarProps {
  assignments: RosterAssignment[];
  staff: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  onAssignmentClick?: (assignment: RosterAssignment) => void;
}

export const RosterCalendar = ({ assignments, staff, onAssignmentClick }: RosterCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Use unified calendar data
  const { data: calendarEvents, isLoading: calendarLoading } = useCalendarData(
    tenantId || '',
    weekStart,
    weekEnd
  );

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
    await queryClient.invalidateQueries({ queryKey: ['staff-schedules', tenantId] });
    await queryClient.invalidateQueries({ queryKey: ['schedule-instances', tenantId] });
    await queryClient.invalidateQueries({ queryKey: ['calendar-data', tenantId] });
    setIsRefreshing(false);
  };

  const getEventsForDateAndStaff = (date: Date, staffId: string) => {
    if (!calendarEvents) return [];
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date) && event.staffId === staffId;
    });
  };

  const getEventColor = (event: any) => {
    if (event.type === 'roster') {
      switch (event.status) {
        case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
        case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      // Schedule events
      return event.hasException 
        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
        : 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const handleCellClick = (date: Date, staffId: string) => {
    setSelectedDate(date);
    setSelectedStaff(staffId);
    setNewAssignmentOpen(true);
  };

  const handleAssignmentSuccess = () => {
    setNewAssignmentOpen(false);
    // Data will automatically refresh due to query invalidation
  };

  const activeStaff = staff.filter(member => member.isActive);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Roster Calendar - Week of {format(weekStart, 'MMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={previousWeek} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextWeek} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={() => setNewAssignmentOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {activeStaff.length} staff members • {calendarEvents?.length || 0} total events this week
            {calendarLoading && <span className="ml-2 text-blue-600">Loading...</span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}>
                <div className="font-semibold text-gray-700 p-2">Staff</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="font-semibold text-gray-700 p-2 text-center">
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
                  </div>
                ))}
              </div>

              {/* Staff Rows */}
              <div className="space-y-1">
                {activeStaff.map((member) => (
                  <div 
                    key={member.id} 
                    className="grid gap-1" 
                    style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}
                  >
                    <div className="p-3 border-r border-gray-200">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="text-xs text-gray-500 truncate">{member.role}</div>
                    </div>
                    {weekDays.map((day) => {
                      const dayEvents = getEventsForDateAndStaff(day, member.id);
                      
                      return (
                        <div 
                          key={`${member.id}-${day.toISOString()}`} 
                          className="min-h-[80px] p-1 border-r border-gray-100 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCellClick(day, member.id)}
                        >
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-2 rounded mb-1 border cursor-pointer hover:opacity-80 ${getEventColor(event)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (event.type === 'roster') {
                                  const rosterAssignment = assignments.find(a => a.id === event.id);
                                  if (rosterAssignment) {
                                    onAssignmentClick?.(rosterAssignment);
                                  }
                                }
                              }}
                            >
                              <div className="font-medium">
                                {format(new Date(event.startTime), 'HH:mm')} - 
                                {format(new Date(event.endTime), 'HH:mm')}
                              </div>
                              <div className="truncate">{event.title}</div>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                                {event.hasException && (
                                  <Badge variant="outline" className="text-xs text-yellow-600">
                                    Modified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          {dayEvents.length === 0 && (
                            <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                              +
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewRosterAssignmentDialog
        open={newAssignmentOpen}
        onOpenChange={setNewAssignmentOpen}
        staff={staff}
        selectedDate={selectedDate}
        selectedStaffId={selectedStaff}
        onSuccess={handleAssignmentSuccess}
      />
    </>
  );
};


import { useQuery } from '@tanstack/react-query';
import { useRosterAssignments } from './useRosterAssignments';
import { useScheduleInstances } from './useScheduleInstances';
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export interface CalendarEvent {
  id: string;
  type: 'roster' | 'schedule';
  staffId: string;
  title: string;
  startTime: string;
  endTime: string;
  status?: string;
  assignmentType?: string;
  hasException?: boolean;
  description?: string;
  notes?: string;
}

export const useCalendarData = (
  tenantId: string, 
  startDate: Date, 
  endDate: Date
) => {
  const { assignments, isLoading: assignmentsLoading } = useRosterAssignments(tenantId);
  const { 
    data: scheduleInstances, 
    isLoading: schedulesLoading 
  } = useScheduleInstances(
    tenantId, 
    format(startDate, 'yyyy-MM-dd'), 
    format(endDate, 'yyyy-MM-dd')
  );

  return useQuery({
    queryKey: [
      'calendar-data', 
      tenantId, 
      format(startDate, 'yyyy-MM-dd'), 
      format(endDate, 'yyyy-MM-dd'),
      assignments?.length,
      scheduleInstances?.length
    ],
    queryFn: async (): Promise<CalendarEvent[]> => {
      console.log('Generating calendar data for:', format(startDate, 'yyyy-MM-dd'), 'to', format(endDate, 'yyyy-MM-dd'));
      const events: CalendarEvent[] = [];

      // Add roster assignments as events
      if (assignments) {
        console.log('Processing', assignments.length, 'roster assignments');
        
        const filteredAssignments = assignments.filter(assignment => {
          const assignmentStartDate = startOfDay(new Date(assignment.startTime));
          const assignmentEndDate = startOfDay(new Date(assignment.endTime));
          const rangeStart = startOfDay(startDate);
          const rangeEnd = endOfDay(endDate);
          
          // Check if assignment overlaps with the requested date range
          return (
            isWithinInterval(assignmentStartDate, { start: rangeStart, end: rangeEnd }) ||
            isWithinInterval(assignmentEndDate, { start: rangeStart, end: rangeEnd }) ||
            (assignmentStartDate <= rangeStart && assignmentEndDate >= rangeEnd)
          );
        });

        console.log('Filtered to', filteredAssignments.length, 'assignments in date range');

        events.push(...filteredAssignments.map(assignment => ({
          id: assignment.id,
          type: 'roster' as const,
          staffId: assignment.staffId,
          title: `Roster: ${assignment.assignmentType}`,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
          status: assignment.status,
          assignmentType: assignment.assignmentType,
          notes: assignment.notes,
        })));
      }

      // Add schedule instances as events
      if (scheduleInstances) {
        console.log('Processing', scheduleInstances.length, 'schedule instances');
        
        events.push(...scheduleInstances.map(instance => ({
          id: `schedule-${instance.staffId}-${instance.instanceDate}`,
          type: 'schedule' as const,
          staffId: instance.staffId,
          title: instance.title,
          startTime: instance.startTime,
          endTime: instance.endTime,
          hasException: instance.hasException,
          description: instance.description,
        })));
      }

      // Sort events by start time
      events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      console.log('Generated', events.length, 'total calendar events');
      return events;
    },
    enabled: !!tenantId && !assignmentsLoading && !schedulesLoading,
  });
};

export const useCalendarEventsForDate = (
  tenantId: string, 
  date: Date
) => {
  const { data: calendarData, isLoading } = useCalendarData(tenantId, date, date);

  return {
    events: calendarData?.filter(event => {
      const eventStartDate = startOfDay(new Date(event.startTime));
      const eventEndDate = startOfDay(new Date(event.endTime));
      const checkDate = startOfDay(date);
      
      if (event.type === 'roster') {
        // For roster assignments, check if the date falls within the assignment period
        if (isSameDay(eventStartDate, eventEndDate)) {
          return isSameDay(eventStartDate, checkDate);
        }
        return isWithinInterval(checkDate, {
          start: eventStartDate,
          end: eventEndDate
        });
      } else {
        // For schedule events, use exact date match
        return isSameDay(new Date(event.startTime), date);
      }
    }) || [],
    isLoading
  };
};

export const useCalendarEventsForStaff = (
  tenantId: string, 
  staffId: string, 
  startDate: Date, 
  endDate: Date
) => {
  const { data: calendarData, isLoading } = useCalendarData(tenantId, startDate, endDate);

  return {
    events: calendarData?.filter(event => event.staffId === staffId) || [],
    isLoading
  };
};

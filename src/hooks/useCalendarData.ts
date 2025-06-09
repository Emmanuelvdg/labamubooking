
import { useQuery } from '@tanstack/react-query';
import { useRosterAssignments } from './useRosterAssignments';
import { useScheduleInstances } from './useStaffSchedules';
import { format, isSameDay } from 'date-fns';

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
      const events: CalendarEvent[] = [];

      // Add roster assignments as events
      if (assignments) {
        const filteredAssignments = assignments.filter(assignment => {
          const assignmentDate = new Date(assignment.startTime);
          return assignmentDate >= startDate && assignmentDate <= endDate;
        });

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
    events: calendarData?.filter(event => 
      isSameDay(new Date(event.startTime), date)
    ) || [],
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


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScheduleConflict {
  id: string;
  type: 'roster_overlap' | 'schedule_overlap' | 'availability_conflict';
  severity: 'info' | 'warning' | 'error';
  message: string;
  conflictingItem?: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    type: 'roster' | 'schedule';
  };
}

export const useScheduleConflictDetection = (tenantId: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);

  const createTimestampInUserTimezone = (dateTimeString: string): string => {
    // If the string doesn't contain timezone info, treat it as local time
    if (!dateTimeString.includes('T') || (!dateTimeString.includes('Z') && !dateTimeString.includes('+'))) {
      const localDateTime = new Date(dateTimeString);
      return localDateTime.toISOString();
    }
    return dateTimeString;
  };

  const checkConflicts = async (
    staffId: string,
    startTime: string,
    endTime: string,
    scheduleId?: string
  ): Promise<ScheduleConflict[]> => {
    console.log('Starting conflict detection:', { staffId, startTime, endTime, scheduleId });
    setIsChecking(true);
    
    try {
      const detectedConflicts: ScheduleConflict[] = [];

      // Ensure timestamps are timezone-aware
      const conflictStartTime = createTimestampInUserTimezone(startTime);
      const conflictEndTime = createTimestampInUserTimezone(endTime);

      console.log('Using timezone-aware timestamps for conflict check:', {
        original: { startTime, endTime },
        converted: { conflictStartTime, conflictEndTime }
      });

      // Check roster assignment conflicts
      const { data: rosterConflicts, error: rosterError } = await supabase.rpc(
        'check_roster_conflicts',
        {
          p_assignment_id: null,
          p_staff_id: staffId,
          p_start_time: conflictStartTime,
          p_end_time: conflictEndTime,
          p_tenant_id: tenantId
        }
      );

      if (rosterError) {
        console.error('Error checking roster conflicts:', rosterError);
        throw rosterError;
      }

      if (rosterConflicts && rosterConflicts.length > 0) {
        rosterConflicts.forEach((conflict: any) => {
          detectedConflicts.push({
            id: conflict.conflict_id,
            type: 'roster_overlap',
            severity: conflict.severity as 'info' | 'warning' | 'error',
            message: conflict.message
          });
        });
      }

      // Check existing schedule conflicts
      const { data: schedules, error: schedulesError } = await supabase
        .from('staff_schedules')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('staff_id', staffId)
        .neq('id', scheduleId || '00000000-0000-0000-0000-000000000000');

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
        throw schedulesError;
      }

      const newStartTime = new Date(conflictStartTime);
      const newEndTime = new Date(conflictEndTime);

      schedules?.forEach((schedule) => {
        const existingStart = new Date(schedule.start_time);
        const existingEnd = new Date(schedule.end_time);

        // Check for time overlap
        const hasOverlap = (
          (newStartTime >= existingStart && newStartTime < existingEnd) ||
          (newEndTime > existingStart && newEndTime <= existingEnd) ||
          (newStartTime <= existingStart && newEndTime >= existingEnd)
        );

        if (hasOverlap) {
          detectedConflicts.push({
            id: `schedule-${schedule.id}`,
            type: 'schedule_overlap',
            severity: 'error',
            message: `Overlaps with existing schedule: ${schedule.title}`,
            conflictingItem: {
              id: schedule.id,
              title: schedule.title,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
              type: 'schedule'
            }
          });
        }
      });

      console.log('Detected conflicts:', detectedConflicts);
      setConflicts(detectedConflicts);
      return detectedConflicts;

    } catch (error) {
      console.error('Error during conflict detection:', error);
      toast.error('Failed to check for conflicts');
      return [];
    } finally {
      setIsChecking(false);
    }
  };

  const clearConflicts = () => {
    setConflicts([]);
  };

  return {
    conflicts,
    isChecking,
    checkConflicts,
    clearConflicts
  };
};

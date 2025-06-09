
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StaffSchedule } from '@/types/schedule';
import { useScheduleCacheInvalidation } from './useScheduleCacheInvalidation';

export const useUpdateSchedule = () => {
  return useMutation({
    mutationFn: async ({ id, ...scheduleData }: StaffSchedule) => {
      console.log('Updating schedule:', id, scheduleData);
      
      const { data, error } = await supabase
        .from('staff_schedules')
        .update({
          title: scheduleData.title,
          description: scheduleData.description,
          start_time: scheduleData.startTime,
          end_time: scheduleData.endTime,
          is_recurring: scheduleData.isRecurring,
          repeat_type: scheduleData.repeatType,
          repeat_interval: scheduleData.repeatInterval,
          repeat_end_date: scheduleData.repeatEndDate,
          repeat_count: scheduleData.repeatCount,
          weekly_pattern: scheduleData.weeklyPattern,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const invalidateAllCalendarData = useScheduleCacheInvalidation(data.tenant_id);
      invalidateAllCalendarData();
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    },
  });
};

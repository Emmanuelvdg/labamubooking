
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StaffSchedule, CreateScheduleData } from '@/types/schedule';
import { useScheduleCacheInvalidation } from './useScheduleCacheInvalidation';

export const useCreateSchedule = () => {
  return useMutation({
    mutationFn: async (scheduleData: CreateScheduleData) => {
      console.log('Creating schedule:', scheduleData);
      
      const { data, error } = await supabase
        .from('staff_schedules')
        .insert([{
          tenant_id: scheduleData.tenantId,
          staff_id: scheduleData.staffId,
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
        }])
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
        description: 'Schedule created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      });
    },
  });
};

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

export const useDeleteSchedule = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting schedule:', id);
      
      // Get the schedule data before deletion for cache invalidation
      const { data: scheduleData } = await supabase
        .from('staff_schedules')
        .select('tenant_id')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('staff_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return scheduleData;
    },
    onSuccess: (scheduleData) => {
      if (scheduleData) {
        const invalidateAllCalendarData = useScheduleCacheInvalidation(scheduleData.tenant_id);
        invalidateAllCalendarData();
      }
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete schedule',
        variant: 'destructive',
      });
    },
  });
};

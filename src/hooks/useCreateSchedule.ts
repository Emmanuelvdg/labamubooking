
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CreateScheduleData } from '@/types/schedule';

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  
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
      // Invalidate all calendar-related queries
      queryClient.invalidateQueries({ queryKey: ['staff-schedules', data.tenant_id] });
      queryClient.invalidateQueries({ queryKey: ['schedule-instances', data.tenant_id] });
      queryClient.invalidateQueries({ queryKey: ['roster-assignments', data.tenant_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', data.tenant_id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-data', data.tenant_id] });
      
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

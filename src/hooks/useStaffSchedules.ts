import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StaffSchedule, CreateScheduleData, ScheduleInstance } from '@/types/schedule';

export const useStaffSchedules = (tenantId: string) => {
  return useQuery({
    queryKey: ['staff-schedules', tenantId],
    queryFn: async () => {
      console.log('Fetching staff schedules for tenant:', tenantId);
      
      const { data, error } = await supabase
        .from('staff_schedules')
        .select(`
          *,
          staff:staff(name, email)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(schedule => ({
        id: schedule.id,
        tenantId: schedule.tenant_id,
        staffId: schedule.staff_id,
        title: schedule.title,
        description: schedule.description,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        isRecurring: schedule.is_recurring,
        repeatType: schedule.repeat_type,
        repeatInterval: schedule.repeat_interval,
        repeatEndDate: schedule.repeat_end_date,
        repeatCount: schedule.repeat_count,
        weeklyPattern: schedule.weekly_pattern,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at,
        staff: schedule.staff
      })) as (StaffSchedule & { staff: { name: string; email: string } })[];
    },
    enabled: !!tenantId,
  });
};

export const useScheduleInstances = (tenantId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['schedule-instances', tenantId, startDate, endDate],
    queryFn: async () => {
      console.log('Fetching schedule instances for period:', startDate, 'to', endDate);
      
      // Get all schedules for the tenant
      const { data: schedules, error: schedulesError } = await supabase
        .from('staff_schedules')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (schedulesError) throw schedulesError;
      
      const allInstances: ScheduleInstance[] = [];
      
      // Generate instances for each schedule
      for (const schedule of schedules) {
        const { data: instances, error: instancesError } = await supabase
          .rpc('generate_schedule_instances', {
            schedule_id: schedule.id,
            start_date: startDate,
            end_date: endDate
          });
        
        if (instancesError) {
          console.error('Error generating instances for schedule:', schedule.id, instancesError);
          continue;
        }
        
        // Map the database response to our ScheduleInstance type
        const mappedInstances = (instances || []).map(instance => ({
          instanceDate: instance.instance_date,
          startTime: instance.start_time,
          endTime: instance.end_time,
          title: instance.title,
          description: instance.description,
          staffId: instance.staff_id,
          hasException: instance.has_exception
        }));
        
        allInstances.push(...mappedInstances);
      }
      
      return allInstances;
    },
    enabled: !!tenantId && !!startDate && !!endDate,
  });
};

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-instances'] });
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
  const queryClient = useQueryClient();
  
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-instances'] });
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting schedule:', id);
      
      const { error } = await supabase
        .from('staff_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-instances'] });
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

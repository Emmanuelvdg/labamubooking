
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffSchedule } from '@/types/schedule';

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

// Re-export the hooks from the separate files for backward compatibility
export { useScheduleInstances } from './useScheduleInstances';
export { useCreateSchedule } from './useCreateSchedule';
export { useUpdateSchedule } from './useUpdateSchedule';
export { useDeleteSchedule } from './useDeleteSchedule';

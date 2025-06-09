
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleInstance } from '@/types/schedule';

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
        console.log('Generating instances for schedule:', schedule.id, schedule.title);
        
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
        
        console.log('Generated instances:', instances);
        
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
        
        console.log('Mapped instances:', mappedInstances);
        allInstances.push(...mappedInstances);
      }
      
      console.log('Total instances generated:', allInstances.length);
      return allInstances;
    },
    enabled: !!tenantId && !!startDate && !!endDate,
  });
};

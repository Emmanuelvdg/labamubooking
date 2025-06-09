
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
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
        // Invalidate all calendar-related queries
        queryClient.invalidateQueries({ queryKey: ['staff-schedules', scheduleData.tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['schedule-instances', scheduleData.tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['roster-assignments', scheduleData.tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['bookings', scheduleData.tenant_id] });
        queryClient.invalidateQueries({ queryKey: ['calendar-data', scheduleData.tenant_id] });
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

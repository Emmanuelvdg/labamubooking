
import { useQueryClient } from '@tanstack/react-query';

export const useScheduleCacheInvalidation = (tenantId: string) => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['staff-schedules', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['schedule-instances', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['bookings', tenantId] });
    queryClient.invalidateQueries({ queryKey: ['calendar-data', tenantId] });
  };
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilitySlot } from '@/types/onlineBooking';

export const useAvailableSlots = (tenantId: string, staffId: string, serviceId: string, date: string) => {
  return useQuery({
    queryKey: ['available-slots', tenantId, staffId, serviceId, date],
    queryFn: async () => {
      console.log('Fetching available slots for:', { tenantId, staffId, serviceId, date });
      
      if (!tenantId || !staffId || !serviceId || !date) {
        console.log('Missing required parameters for slots query');
        return [];
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('staff_id', staffId)
        .eq('service_id', serviceId)
        .eq('is_available', true)
        .eq('is_booked', false)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching availability slots:', error);
        throw error;
      }
      
      console.log('Available slots found:', data?.length || 0);
      
      // Map snake_case to camelCase
      return (data || []).map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        staffId: item.staff_id,
        serviceId: item.service_id,
        startTime: item.start_time,
        endTime: item.end_time,
        isAvailable: item.is_available,
        isBooked: item.is_booked,
        bookingId: item.booking_id,
        createdAt: item.created_at,
      })) as AvailabilitySlot[];
    },
    enabled: !!tenantId && !!staffId && !!serviceId && !!date,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

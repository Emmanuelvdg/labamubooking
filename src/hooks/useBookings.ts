
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useBookings = (tenantId: string) => {
  return useQuery({
    queryKey: ['bookings', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return data.map(booking => ({
        id: booking.id,
        tenantId: booking.tenant_id,
        customerId: booking.customer_id,
        staffId: booking.staff_id,
        serviceId: booking.service_id,
        startTime: booking.start_time,
        endTime: booking.end_time,
        status: booking.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
        notes: booking.notes,
        customer: {
          id: booking.customer.id,
          tenantId: booking.customer.tenant_id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          avatar: booking.customer.avatar,
        },
        staff: {
          id: booking.staff.id,
          tenantId: booking.staff.tenant_id,
          name: booking.staff.name,
          email: booking.staff.email,
          role: booking.staff.role,
          skills: booking.staff.skills || [],
          avatar: booking.staff.avatar,
          isActive: booking.staff.is_active,
        },
        service: {
          id: booking.service.id,
          tenantId: booking.service.tenant_id,
          name: booking.service.name,
          description: booking.service.description,
          duration: booking.service.duration,
          price: booking.service.price,
        },
      })) as Booking[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'customer' | 'staff' | 'service'>) => {
      // Transform camelCase to snake_case for database
      const dbBooking = {
        tenant_id: booking.tenantId,
        customer_id: booking.customerId,
        staff_id: booking.staffId,
        service_id: booking.serviceId,
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        notes: booking.notes,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([dbBooking])
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .single();
      
      if (error) throw error;
      
      // Transform response back to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        customerId: data.customer_id,
        staffId: data.staff_id,
        serviceId: data.service_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
        notes: data.notes,
        customer: {
          id: data.customer.id,
          tenantId: data.customer.tenant_id,
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          avatar: data.customer.avatar,
        },
        staff: {
          id: data.staff.id,
          tenantId: data.staff.tenant_id,
          name: data.staff.name,
          email: data.staff.email,
          role: data.staff.role,
          skills: data.staff.skills || [],
          avatar: data.staff.avatar,
          isActive: data.staff.is_active,
        },
        service: {
          id: data.service.id,
          tenantId: data.service.tenant_id,
          name: data.service.name,
          description: data.service.description,
          duration: data.service.duration,
          price: data.service.price,
        },
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Success',
        description: 'Booking created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
      console.error('Error creating booking:', error);
    },
  });
};

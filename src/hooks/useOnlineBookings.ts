
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OnlineBooking, OnlineBookingFormData, PublicBusinessProfile, BookingSettings, PublicStaffProfile, PublicServiceProfile, AvailabilitySlot } from '@/types/onlineBooking';

export const usePublicBusinessProfile = (slug: string) => {
  return useQuery({
    queryKey: ['public-business-profile', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_business_profiles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as PublicBusinessProfile;
    },
    enabled: !!slug,
  });
};

export const useBookingSettings = (tenantId: string) => {
  return useQuery({
    queryKey: ['booking-settings', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data as BookingSettings;
    },
    enabled: !!tenantId,
  });
};

export const usePublicStaffProfiles = (tenantId: string) => {
  return useQuery({
    queryKey: ['public-staff-profiles', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_staff_profiles')
        .select(`
          *,
          staff!inner(id, name, email, role, skills, is_active)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_visible', true)
        .eq('staff.is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as (PublicStaffProfile & { staff: any })[];
    },
    enabled: !!tenantId,
  });
};

export const usePublicServiceProfiles = (tenantId: string) => {
  return useQuery({
    queryKey: ['public-service-profiles', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_service_profiles')
        .select(`
          *,
          services!inner(id, name, description, duration, price)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_visible', true)
        .eq('online_booking_enabled', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as (PublicServiceProfile & { services: any })[];
    },
    enabled: !!tenantId,
  });
};

export const useAvailableSlots = (tenantId: string, staffId: string, serviceId: string, date: string) => {
  return useQuery({
    queryKey: ['available-slots', tenantId, staffId, serviceId, date],
    queryFn: async () => {
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

      if (error) throw error;
      return data as AvailabilitySlot[];
    },
    enabled: !!tenantId && !!staffId && !!serviceId && !!date,
  });
};

export const useCreateOnlineBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: OnlineBookingFormData & { tenantId: string }) => {
      // First check for conflicts
      const conflictResponse = await supabase.rpc('check_online_booking_conflicts', {
        p_tenant_id: bookingData.tenantId,
        p_staff_id: bookingData.staffId,
        p_start_time: bookingData.startTime,
        p_end_time: new Date(new Date(bookingData.startTime).getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1 hour duration for now
      });

      if (conflictResponse.error) throw conflictResponse.error;
      if (conflictResponse.data) {
        throw new Error('This time slot is no longer available');
      }

      // Get service details for end time calculation
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration')
        .eq('id', bookingData.serviceId)
        .single();

      if (serviceError) throw serviceError;

      const endTime = new Date(new Date(bookingData.startTime).getTime() + service.duration * 60 * 1000);

      const { data, error } = await supabase
        .from('online_bookings')
        .insert({
          tenant_id: bookingData.tenantId,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          service_id: bookingData.serviceId,
          staff_id: bookingData.staffId,
          start_time: bookingData.startTime,
          end_time: endTime.toISOString(),
          customer_notes: bookingData.customerNotes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data as OnlineBooking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: 'Booking Submitted',
        description: `Your booking request has been submitted. Reference: ${data.bookingReference}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
    },
  });
};

export const useOnlineBookings = (tenantId: string) => {
  return useQuery({
    queryKey: ['online-bookings', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('online_bookings')
        .select(`
          *,
          services!inner(name, duration, price),
          staff!inner(name, email)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (OnlineBooking & { services: any; staff: any })[];
    },
    enabled: !!tenantId,
  });
};

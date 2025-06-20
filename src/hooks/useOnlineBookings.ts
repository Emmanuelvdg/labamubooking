
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OnlineBooking, OnlineBookingFormData, PublicBusinessProfile, BookingSettings, PublicStaffProfile, PublicServiceProfile } from '@/types/onlineBooking';

export const usePublicBusinessProfile = (slug: string) => {
  return useQuery({
    queryKey: ['public-business-profile', slug],
    queryFn: async () => {
      console.log('Fetching business profile for slug:', slug);
      
      const { data, error } = await supabase
        .from('public_business_profiles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error) {
        console.error('Error fetching business profile:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No business profile found for slug:', slug);
        return null;
      }
      
      console.log('Business profile found:', data);
      
      // Map snake_case to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        slug: data.slug,
        displayName: data.display_name,
        description: data.description,
        logoUrl: data.logo_url,
        coverImageUrl: data.cover_image_url,
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        address: data.address,
        businessHours: data.business_hours,
        socialLinks: data.social_links,
        isActive: data.is_active,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as PublicBusinessProfile;
    },
    enabled: !!slug,
  });
};

export const useBookingSettings = (tenantId: string) => {
  return useQuery({
    queryKey: ['booking-settings', tenantId],
    queryFn: async () => {
      console.log('Fetching booking settings for tenant:', tenantId);
      
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle(); // Use maybeSingle to handle cases where no settings exist

      if (error) {
        console.error('Error fetching booking settings:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No booking settings found for tenant:', tenantId);
        // Return default settings
        return {
          id: '',
          tenantId: tenantId,
          advanceBookingDays: 30,
          minAdvanceHours: 2,
          maxAdvanceHours: 720,
          allowSameDayBooking: true,
          requireCustomerPhone: false,
          requireCustomerNotes: false,
          autoConfirmBookings: false,
          sendConfirmationEmail: true,
          sendReminderEmail: true,
          reminderHoursBefore: 24,
          cancellationPolicy: null,
          termsAndConditions: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as BookingSettings;
      }
      
      // Map snake_case to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        advanceBookingDays: data.advance_booking_days,
        minAdvanceHours: data.min_advance_hours,
        maxAdvanceHours: data.max_advance_hours,
        allowSameDayBooking: data.allow_same_day_booking,
        requireCustomerPhone: data.require_customer_phone,
        requireCustomerNotes: data.require_customer_notes,
        autoConfirmBookings: data.auto_confirm_bookings,
        sendConfirmationEmail: data.send_confirmation_email,
        sendReminderEmail: data.send_reminder_email,
        reminderHoursBefore: data.reminder_hours_before,
        cancellationPolicy: data.cancellation_policy,
        termsAndConditions: data.terms_and_conditions,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as BookingSettings;
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
          staff!inner(id, name, email, role, skills, is_active, avatar)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_visible', true)
        .eq('staff.is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Map snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        staffId: item.staff_id,
        tenantId: item.tenant_id,
        displayName: item.display_name,
        bio: item.bio,
        profileImageUrl: item.staff.avatar, // Use staff avatar instead of profile_image_url
        specialties: item.specialties,
        yearsExperience: item.years_experience,
        isVisible: item.is_visible,
        displayOrder: item.display_order,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        staff: item.staff,
      })) as (PublicStaffProfile & { staff: any })[];
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
      
      // Map snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        serviceId: item.service_id,
        tenantId: item.tenant_id,
        displayName: item.display_name,
        description: item.description,
        imageUrl: item.image_url,
        features: item.features,
        isVisible: item.is_visible,
        displayOrder: item.display_order,
        onlineBookingEnabled: item.online_booking_enabled,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        services: item.services,
      })) as (PublicServiceProfile & { services: any })[];
    },
    enabled: !!tenantId,
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
      
      // Map snake_case to camelCase
      return {
        id: data.id,
        tenantId: data.tenant_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        serviceId: data.service_id,
        staffId: data.staff_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status,
        customerNotes: data.customer_notes,
        internalNotes: data.internal_notes,
        confirmationToken: data.confirmation_token,
        cancellationToken: data.cancellation_token,
        totalPrice: data.total_price,
        bookingReference: data.booking_reference,
        source: data.source,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as OnlineBooking;
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
      
      // Map snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        customerName: item.customer_name,
        customerEmail: item.customer_email,
        customerPhone: item.customer_phone,
        serviceId: item.service_id,
        staffId: item.staff_id,
        startTime: item.start_time,
        endTime: item.end_time,
        status: item.status,
        customerNotes: item.customer_notes,
        internalNotes: item.internal_notes,
        confirmationToken: item.confirmation_token,
        cancellationToken: item.cancellation_token,
        totalPrice: item.total_price,
        bookingReference: item.booking_reference,
        source: item.source,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        services: item.services,
        staff: item.staff,
      })) as (OnlineBooking & { services: any; staff: any })[];
    },
    enabled: !!tenantId,
  });
};


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLogBookingEdit } from './useBookingEdits';
import { Booking } from '@/types';

export interface EditBookingData {
  id: string;
  customerId?: string;
  staffId?: string;
  serviceId?: string;
  startTime?: string;
  endTime?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  reason?: string;
}

export const useEditBooking = () => {
  const queryClient = useQueryClient();
  const logBookingEdit = useLogBookingEdit();
  
  return useMutation({
    mutationFn: async (editData: EditBookingData) => {
      console.log('Editing booking:', editData);
      
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session error. Please refresh the page and try again.');
      }
      
      if (!session || !session.user) {
        console.error('No valid session found');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Validate that the session is not expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.error('Session has expired');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      console.log('Valid session found, proceeding with booking update');
      
      // First, get the current booking data
      const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .eq('id', editData.id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current booking:', fetchError);
        throw new Error('Failed to fetch current booking data');
      }
      
      // Prepare the update data
      const updateData: any = {};
      const oldValues: any = {};
      const newValues: any = {};
      let editType = 'notes_update';
      
      if (editData.customerId && editData.customerId !== currentBooking.customer_id) {
        updateData.customer_id = editData.customerId;
        oldValues.customerId = currentBooking.customer_id;
        newValues.customerId = editData.customerId;
        editType = 'service_change';
      }
      
      if (editData.staffId && editData.staffId !== currentBooking.staff_id) {
        updateData.staff_id = editData.staffId;
        oldValues.staffId = currentBooking.staff_id;
        newValues.staffId = editData.staffId;
        editType = 'staff_change';
      }
      
      if (editData.serviceId && editData.serviceId !== currentBooking.service_id) {
        updateData.service_id = editData.serviceId;
        oldValues.serviceId = currentBooking.service_id;
        newValues.serviceId = editData.serviceId;
        editType = 'service_change';
      }
      
      if (editData.startTime && editData.startTime !== currentBooking.start_time) {
        updateData.start_time = editData.startTime;
        oldValues.startTime = currentBooking.start_time;
        newValues.startTime = editData.startTime;
        editType = 'reschedule';
      }
      
      if (editData.endTime && editData.endTime !== currentBooking.end_time) {
        updateData.end_time = editData.endTime;
        oldValues.endTime = currentBooking.end_time;
        newValues.endTime = editData.endTime;
        editType = 'reschedule';
      }
      
      if (editData.status && editData.status !== currentBooking.status) {
        updateData.status = editData.status;
        oldValues.status = currentBooking.status;
        newValues.status = editData.status;
        editType = 'status_change';
      }
      
      if (editData.notes !== undefined && editData.notes !== currentBooking.notes) {
        updateData.notes = editData.notes;
        oldValues.notes = currentBooking.notes;
        newValues.notes = editData.notes;
        editType = 'notes_update';
      }
      
      // Update the booking
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editData.id)
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .single();
      
      if (updateError) {
        console.error('Error updating booking:', updateError);
        throw new Error('Failed to update booking: ' + updateError.message);
      }
      
      // Log the edit if there were changes
      if (Object.keys(oldValues).length > 0) {
        try {
          await logBookingEdit.mutateAsync({
            bookingId: editData.id,
            tenantId: currentBooking.tenant_id,
            editedBy: session.user.id,
            editType,
            oldValues,
            newValues,
            reason: editData.reason,
          });
        } catch (logError) {
          console.warn('Failed to log booking edit:', logError);
          // Don't fail the entire operation if logging fails
        }
      }
      
      return {
        id: updatedBooking.id,
        tenantId: updatedBooking.tenant_id,
        customerId: updatedBooking.customer_id,
        staffId: updatedBooking.staff_id,
        serviceId: updatedBooking.service_id,
        startTime: updatedBooking.start_time,
        endTime: updatedBooking.end_time,
        status: updatedBooking.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
        notes: updatedBooking.notes,
        customer: {
          id: updatedBooking.customer.id,
          tenantId: updatedBooking.customer.tenant_id,
          name: updatedBooking.customer.name,
          email: updatedBooking.customer.email,
          phone: updatedBooking.customer.phone,
          avatar: updatedBooking.customer.avatar,
        },
        staff: {
          id: updatedBooking.staff.id,
          tenantId: updatedBooking.staff.tenant_id,
          name: updatedBooking.staff.name,
          email: updatedBooking.staff.email,
          role: updatedBooking.staff.role,
          skills: updatedBooking.staff.skills || [],
          avatar: updatedBooking.staff.avatar,
          isActive: updatedBooking.staff.is_active,
        },
        service: {
          id: updatedBooking.service.id,
          tenantId: updatedBooking.service.tenant_id,
          name: updatedBooking.service.name,
          description: updatedBooking.service.description,
          duration: updatedBooking.service.duration,
          price: updatedBooking.service.price,
        },
      } as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Success',
        description: 'Booking updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to update booking';
      if (error.message.includes('session')) {
        errorMessage = 'Your session has expired. Please refresh the page and log in again.';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

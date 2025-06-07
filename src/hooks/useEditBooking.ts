
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
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
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
      
      if (fetchError) throw fetchError;
      
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
      
      if (updateError) throw updateError;
      
      // Log the edit if there were changes
      if (Object.keys(oldValues).length > 0) {
        await logBookingEdit.mutateAsync({
          bookingId: editData.id,
          tenantId: currentBooking.tenant_id,
          editedBy: user.id, // Use authenticated user ID instead of customer ID
          editType,
          oldValues,
          newValues,
          reason: editData.reason,
        });
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
      toast({
        title: 'Error',
        description: 'Failed to update booking',
        variant: 'destructive',
      });
    },
  });
};

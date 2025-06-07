
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BookingEdit {
  id: string;
  bookingId: string;
  tenantId: string;
  editedBy: string;
  editType: 'status_change' | 'reschedule' | 'service_change' | 'staff_change' | 'notes_update';
  oldValues: any;
  newValues: any;
  reason?: string;
  createdAt: string;
}

export interface BookingConflict {
  id: string;
  bookingId: string;
  conflictingBookingId: string;
  conflictType: 'staff_double_booking' | 'time_overlap' | 'service_unavailable';
  severity: 'warning' | 'error';
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export const useBookingEdits = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking-edits', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_edits')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(edit => ({
        id: edit.id,
        bookingId: edit.booking_id,
        tenantId: edit.tenant_id,
        editedBy: edit.edited_by,
        editType: edit.edit_type,
        oldValues: edit.old_values,
        newValues: edit.new_values,
        reason: edit.reason,
        createdAt: edit.created_at,
      })) as BookingEdit[];
    },
    enabled: !!bookingId,
  });
};

export const useCheckBookingConflicts = () => {
  return useMutation({
    mutationFn: async ({
      bookingId,
      staffId,
      startTime,
      endTime,
      tenantId
    }: {
      bookingId?: string;
      staffId: string;
      startTime: string;
      endTime: string;
      tenantId: string;
    }) => {
      const { data, error } = await supabase.rpc('check_booking_conflicts', {
        p_booking_id: bookingId || null,
        p_staff_id: staffId,
        p_start_time: startTime,
        p_end_time: endTime,
        p_tenant_id: tenantId
      });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useLogBookingEdit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      bookingId,
      tenantId,
      editedBy,
      editType,
      oldValues,
      newValues,
      reason
    }: {
      bookingId: string;
      tenantId: string;
      editedBy: string;
      editType: string;
      oldValues: any;
      newValues: any;
      reason?: string;
    }) => {
      const { data, error } = await supabase.rpc('log_booking_edit', {
        p_booking_id: bookingId,
        p_tenant_id: tenantId,
        p_edited_by: editedBy,
        p_edit_type: editType,
        p_old_values: oldValues,
        p_new_values: newValues,
        p_reason: reason
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-edits', variables.bookingId] });
    },
  });
};


import { useState, useCallback } from 'react';
import { useEditBooking } from '@/hooks/useEditBooking';
import { useCheckBookingConflicts, useBookingEdits } from '@/hooks/useBookingEdits';
import { useCustomers } from '@/hooks/useCustomers';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { Booking } from '@/types';

interface FormData {
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  status: string;
  notes: string;
  reason: string;
}

export const useEditBookingForm = (booking: Booking, onSuccess?: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    customerId: booking.customerId,
    staffId: booking.staffId,
    serviceId: booking.serviceId,
    startTime: new Date(booking.startTime).toISOString().slice(0, 16),
    status: booking.status,
    notes: booking.notes || '',
    reason: ''
  });
  
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  const { tenantId } = useTenant();
  const { data: customers } = useCustomers(tenantId || '');
  const { data: staff } = useStaff(tenantId || '');
  const { data: services } = useServices(tenantId || '');
  const { data: bookingEdits } = useBookingEdits(booking.id);
  
  const editBooking = useEditBooking();
  const checkConflicts = useCheckBookingConflicts();

  const handleTimeChange = useCallback(async (newStartTime: string) => {
    console.log('Time change triggered:', newStartTime);
    setFormData(prev => ({ ...prev, startTime: newStartTime }));
    
    const selectedService = services?.find(s => s.id === formData.serviceId);
    if (!selectedService || !tenantId || isCheckingConflicts) {
      return;
    }

    setIsCheckingConflicts(true);
    try {
      const startTime = new Date(newStartTime);
      const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

      const conflictResults = await checkConflicts.mutateAsync({
        bookingId: booking.id,
        staffId: formData.staffId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        tenantId,
      });
      
      setConflicts(conflictResults);
    } catch (error) {
      console.error('Error checking conflicts:', error);
      setConflicts([]);
    } finally {
      setIsCheckingConflicts(false);
    }
  }, [services, formData.serviceId, formData.staffId, tenantId, booking.id, checkConflicts, isCheckingConflicts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) return;

    const selectedService = services?.find(s => s.id === formData.serviceId);
    if (!selectedService) return;

    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

    try {
      await editBooking.mutateAsync({
        id: booking.id,
        customerId: formData.customerId,
        staffId: formData.staffId,
        serviceId: formData.serviceId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: formData.status,
        notes: formData.notes,
        reason: formData.reason,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    updateFormData,
    conflicts,
    isCheckingConflicts,
    customers,
    staff,
    services,
    bookingEdits,
    editBooking,
    handleTimeChange,
    handleSubmit,
  };
};

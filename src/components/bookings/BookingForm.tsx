
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateBooking } from '@/hooks/useBookings';
import { useCustomers, useCreateCustomer } from '@/hooks/useCustomers';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { CustomerFormModal } from './CustomerFormModal';
import { CustomerSelection } from './CustomerSelection';
import { StaffSelection } from './StaffSelection';
import { ServiceSelection } from './ServiceSelection';
import { BookingDetails } from './BookingDetails';
import { BookingSummary } from './BookingSummary';
import { useTenant } from '@/contexts/TenantContext';

interface BookingFormProps {
  onSuccess?: () => void;
}

export const BookingForm = ({ onSuccess }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    customerId: '',
    staffId: '',
    serviceIds: [] as string[],
    startTime: '',
    notes: ''
  });
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

  const { tenantId } = useTenant();
  
  const { data: customers } = useCustomers(tenantId || '');
  const { data: staff } = useStaff(tenantId || '');
  const { data: services } = useServices(tenantId || '');
  const createBooking = useCreateBooking();
  const createCustomer = useCreateCustomer();

  const handleCustomerSelect = (value: string) => {
    if (value === 'create-new') {
      setShowNewCustomerModal(true);
    } else {
      setFormData(prev => ({ ...prev, customerId: value }));
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: checked 
        ? [...prev.serviceIds, serviceId]
        : prev.serviceIds.filter(id => id !== serviceId)
    }));
  };

  const handleNewCustomerCreated = (customerId: string) => {
    setFormData(prev => ({ ...prev, customerId }));
    setShowNewCustomerModal(false);
  };

  const calculateTotalDuration = () => {
    if (!services) return 0;
    return formData.serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.staffId || formData.serviceIds.length === 0 || !formData.startTime || !tenantId) {
      return;
    }

    let customerId = formData.customerId;

    // Handle walk-in customers by creating an anonymous customer record
    if (formData.customerId === 'walk-in') {
      console.log('Creating anonymous customer for walk-in booking');
      try {
        const anonymousCustomer = await createCustomer.mutateAsync({
          tenantId,
          name: 'Walk-in Customer',
          email: `walkin-${Date.now()}@anonymous.local`,
          phone: null,
          avatar: null,
        });
        customerId = anonymousCustomer.id;
        console.log('Created anonymous customer:', anonymousCustomer.id);
      } catch (error) {
        console.error('Failed to create anonymous customer:', error);
        return;
      }
    }

    if (!customerId) {
      console.error('Please select a customer or create a new one');
      return;
    }

    const totalDuration = calculateTotalDuration();
    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    // Create a booking for each selected service
    try {
      for (const serviceId of formData.serviceIds) {
        const selectedService = services?.find(s => s.id === serviceId);
        if (!selectedService) continue;

        const serviceStartTime = new Date(startTime);
        const serviceEndTime = new Date(serviceStartTime.getTime() + selectedService.duration * 60000);

        await createBooking.mutateAsync({
          tenantId,
          customerId,
          staffId: formData.staffId,
          serviceId,
          startTime: serviceStartTime.toISOString(),
          endTime: serviceEndTime.toISOString(),
          status: 'pending',
          notes: formData.notes || undefined,
        });

        // Update start time for next service (sequential booking)
        startTime.setTime(serviceEndTime.getTime());
      }

      onSuccess?.();
      setFormData({ customerId: '', staffId: '', serviceIds: [], startTime: '', notes: '' });
    } catch (error) {
      console.error('Failed to create bookings:', error);
    }
  };

  if (!tenantId) {
    return (
      <div className="text-center text-gray-500">
        <p>No tenant access found. Please contact support.</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <CustomerSelection
            value={formData.customerId}
            onValueChange={handleCustomerSelect}
            customers={customers}
          />

          <StaffSelection
            value={formData.staffId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value }))}
            staff={staff}
          />
        </div>

        <ServiceSelection
          selectedServiceIds={formData.serviceIds}
          onServiceToggle={handleServiceToggle}
          services={services}
        />

        <BookingSummary
          selectedServiceIds={formData.serviceIds}
          services={services}
        />

        <BookingDetails
          startTime={formData.startTime}
          notes={formData.notes}
          onStartTimeChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
          onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={createBooking.isPending || formData.serviceIds.length === 0}
          >
            {createBooking.isPending ? 'Creating...' : `Create ${formData.serviceIds.length} Booking${formData.serviceIds.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </form>

      <CustomerFormModal
        open={showNewCustomerModal}
        onOpenChange={setShowNewCustomerModal}
        onCustomerCreated={handleNewCustomerCreated}
      />
    </>
  );
};

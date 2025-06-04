
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBooking } from '@/hooks/useBookings';
import { useCustomers } from '@/hooks/useCustomers';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { CustomerFormModal } from './CustomerFormModal';

interface BookingFormProps {
  onSuccess?: () => void;
}

export const BookingForm = ({ onSuccess }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    customerId: '',
    staffId: '',
    serviceId: '',
    startTime: '',
    notes: ''
  });
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

  // Using the same UUID format as in the customers page
  const tenantId = '00000000-0000-0000-0000-000000000001';
  
  const { data: customers } = useCustomers(tenantId);
  const { data: staff } = useStaff(tenantId);
  const { data: services } = useServices(tenantId);
  const createBooking = useCreateBooking();

  const handleCustomerSelect = (value: string) => {
    if (value === 'create-new') {
      setShowNewCustomerModal(true);
    } else {
      setFormData(prev => ({ ...prev, customerId: value }));
    }
  };

  const handleNewCustomerCreated = (customerId: string) => {
    setFormData(prev => ({ ...prev, customerId }));
    setShowNewCustomerModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.staffId || !formData.serviceId || !formData.startTime) {
      return;
    }

    // Handle walk-in customers by requiring a customer selection
    if (!formData.customerId || formData.customerId === 'walk-in') {
      console.error('Please select a customer or create a new one for walk-in bookings');
      return;
    }

    const selectedService = services?.find(s => s.id === formData.serviceId);
    if (!selectedService) return;

    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

    await createBooking.mutateAsync({
      tenantId,
      customerId: formData.customerId,
      staffId: formData.staffId,
      serviceId: formData.serviceId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'pending',
      notes: formData.notes || undefined,
    });

    onSuccess?.();
    setFormData({ customerId: '', staffId: '', serviceId: '', startTime: '', notes: '' });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-new">Create New Client</SelectItem>
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select value={formData.staffId} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staff?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.duration}min - ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Date & Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any special notes for this booking..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createBooking.isPending}>
            {createBooking.isPending ? 'Creating...' : 'Create Booking'}
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

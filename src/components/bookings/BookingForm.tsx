
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateBooking } from '@/hooks/useBookings';
import { useCustomers, useCreateCustomer } from '@/hooks/useCustomers';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { CustomerFormModal } from './CustomerFormModal';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

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
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');

  const { tenantId } = useTenant();
  
  const { data: customers } = useCustomers(tenantId || '');
  const { data: staff } = useStaff(tenantId || '');
  const { data: services } = useServices(tenantId || '');
  const createBooking = useCreateBooking();
  const createCustomer = useCreateCustomer();

  // Filter services based on search query
  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.category?.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  ) || [];

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

  const calculateTotalPrice = () => {
    if (!services) return 0;
    return formData.serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
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
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk In (Anonymous)</SelectItem>
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
        </div>

        <div className="space-y-2">
          <Label>Services</Label>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select Services</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                  {filteredServices.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      {serviceSearchQuery ? 'No services found matching your search.' : 'No services available.'}
                    </div>
                  ) : (
                    filteredServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <Checkbox
                          id={service.id}
                          checked={formData.serviceIds.includes(service.id)}
                          onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={service.id} className="font-medium cursor-pointer">
                            {service.name}
                          </Label>
                          <div className="text-sm text-gray-600">
                            {service.duration}min - ${service.price}
                          </div>
                          {service.description && (
                            <div className="text-xs text-gray-500">{service.description}</div>
                          )}
                          {service.category && (
                            <div className="text-xs text-blue-600">{service.category.name}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              {formData.serviceIds.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium">Summary:</div>
                  <div className="text-sm text-gray-600">
                    Total Duration: {calculateTotalDuration()} minutes
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Price: ${calculateTotalPrice()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Date & Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
          />
          <div className="text-xs text-gray-500">
            Services will be scheduled sequentially starting from this time
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

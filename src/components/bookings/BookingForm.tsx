
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import { Users, User, Calendar, FileText } from 'lucide-react';

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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer and Staff Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Customer & Staff</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Select Customer</span>
                </div>
                <CustomerSelection
                  value={formData.customerId}
                  onValueChange={handleCustomerSelect}
                  customers={customers}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Select Staff Member</span>
                </div>
                <StaffSelection
                  value={formData.staffId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value }))}
                  staff={staff}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Services</span>
              </div>
              {formData.serviceIds.length > 0 && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {formData.serviceIds.length} selected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ServiceSelection
              selectedServiceIds={formData.serviceIds}
              onServiceToggle={handleServiceToggle}
              services={services}
            />

            {formData.serviceIds.length > 0 && (
              <>
                <Separator />
                <BookingSummary
                  selectedServiceIds={formData.serviceIds}
                  services={services}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Booking Details Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Booking Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <BookingDetails
                startTime={formData.startTime}
                notes={formData.notes}
                onStartTimeChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Ready to Create Booking?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.serviceIds.length === 0 
                    ? 'Please select at least one service to continue'
                    : `Creating ${formData.serviceIds.length} booking${formData.serviceIds.length !== 1 ? 's' : ''} for your customer`
                  }
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={createBooking.isPending || formData.serviceIds.length === 0}
                className="min-w-[200px] h-12 text-base"
                size="lg"
              >
                {createBooking.isPending ? 'Creating...' : `Create Booking${formData.serviceIds.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <CustomerFormModal
        open={showNewCustomerModal}
        onOpenChange={setShowNewCustomerModal}
        onCustomerCreated={handleNewCustomerCreated}
      />
    </div>
  );
};

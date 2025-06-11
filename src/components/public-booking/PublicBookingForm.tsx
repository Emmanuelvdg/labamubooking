
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useCreateOnlineBooking, useAvailableSlots } from '@/hooks/useOnlineBookings';
import { PublicBusinessProfile, BookingSettings, PublicStaffProfile, PublicServiceProfile, OnlineBookingFormData } from '@/types/onlineBooking';
import { format, addDays, startOfDay } from 'date-fns';

interface PublicBookingFormProps {
  businessProfile: PublicBusinessProfile;
  bookingSettings?: BookingSettings;
  staffProfiles: (PublicStaffProfile & { staff: any })[];
  serviceProfiles: (PublicServiceProfile & { services: any })[];
  preSelectedService?: string | null;
  preSelectedStaff?: string | null;
}

export const PublicBookingForm = ({
  businessProfile,
  bookingSettings,
  staffProfiles,
  serviceProfiles,
  preSelectedService,
  preSelectedStaff
}: PublicBookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState<OnlineBookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: preSelectedService || '',
    staffId: preSelectedStaff || '',
    startTime: '',
    customerNotes: ''
  });

  const createBooking = useCreateOnlineBooking();

  const { data: availableSlots, isLoading: slotsLoading } = useAvailableSlots(
    businessProfile.tenantId,
    formData.staffId,
    formData.serviceId,
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  );

  const selectedService = serviceProfiles.find(sp => sp.serviceId === formData.serviceId);
  const selectedStaff = staffProfiles.find(sp => sp.staffId === formData.staffId);

  const minDate = bookingSettings?.allowSameDayBooking 
    ? startOfDay(new Date())
    : startOfDay(addDays(new Date(), 1));

  const maxDate = bookingSettings?.advanceBookingDays 
    ? addDays(new Date(), bookingSettings.advanceBookingDays)
    : addDays(new Date(), 30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startTime) {
      return;
    }

    await createBooking.mutateAsync({
      ...formData,
      tenantId: businessProfile.tenantId
    });
  };

  const updateFormData = (field: keyof OnlineBookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset dependent fields when service or staff changes
    if (field === 'serviceId' || field === 'staffId') {
      setFormData(prev => ({ ...prev, startTime: '' }));
      setSelectedDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {serviceProfiles.map((serviceProfile) => (
              <div
                key={serviceProfile.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.serviceId === serviceProfile.serviceId
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateFormData('serviceId', serviceProfile.serviceId)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{serviceProfile.displayName}</h3>
                    {serviceProfile.description && (
                      <p className="text-sm text-gray-600 mt-1">{serviceProfile.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{serviceProfile.services.duration} minutes</span>
                      <span>${serviceProfile.services.price}</span>
                    </div>
                  </div>
                  {serviceProfile.imageUrl && (
                    <img 
                      src={serviceProfile.imageUrl} 
                      alt={serviceProfile.displayName}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Selection */}
      {formData.serviceId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {staffProfiles.map((staffProfile) => (
                <div
                  key={staffProfile.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.staffId === staffProfile.staffId
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('staffId', staffProfile.staffId)}
                >
                  <div className="flex items-start space-x-4">
                    {staffProfile.profileImageUrl && (
                      <img 
                        src={staffProfile.profileImageUrl} 
                        alt={staffProfile.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{staffProfile.displayName}</h3>
                      {staffProfile.bio && (
                        <p className="text-sm text-gray-600 mt-1">{staffProfile.bio}</p>
                      )}
                      {staffProfile.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {staffProfile.specialties.map((specialty, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date and Time Selection */}
      {formData.serviceId && formData.staffId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < minDate || date > maxDate}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label>Available Times</Label>
                  {slotsLoading ? (
                    <p>Loading available times...</p>
                  ) : availableSlots && availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          type="button"
                          variant={formData.startTime === slot.startTime ? "default" : "outline"}
                          className="text-sm"
                          onClick={() => updateFormData('startTime', slot.startTime)}
                        >
                          {format(new Date(slot.startTime), 'HH:mm')}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No available times for this date</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Information */}
      {formData.startTime && (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => updateFormData('customerName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => updateFormData('customerEmail', e.target.value)}
                  required
                />
              </div>
            </div>

            {(bookingSettings?.requireCustomerPhone || !bookingSettings) && (
              <div>
                <Label htmlFor="customerPhone">
                  Phone Number {bookingSettings?.requireCustomerPhone ? '*' : ''}
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => updateFormData('customerPhone', e.target.value)}
                  required={bookingSettings?.requireCustomerPhone}
                />
              </div>
            )}

            <div>
              <Label htmlFor="customerNotes">
                Special Requests {bookingSettings?.requireCustomerNotes ? '*' : '(Optional)'}
              </Label>
              <Textarea
                id="customerNotes"
                value={formData.customerNotes}
                onChange={(e) => updateFormData('customerNotes', e.target.value)}
                required={bookingSettings?.requireCustomerNotes}
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Service:</strong> {selectedService?.displayName}</p>
                <p><strong>Staff:</strong> {selectedStaff?.displayName}</p>
                <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {formData.startTime && format(new Date(formData.startTime), 'h:mm a')}</p>
                <p><strong>Duration:</strong> {selectedService?.services.duration} minutes</p>
                <p><strong>Price:</strong> ${selectedService?.services.price}</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? 'Submitting...' : 'Book Appointment'}
            </Button>
          </CardContent>
        </Card>
      )}
    </form>
  );
};

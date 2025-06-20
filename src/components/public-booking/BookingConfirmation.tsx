
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { OnlineBooking, PublicBusinessProfile, PublicStaffProfile, PublicServiceProfile } from '@/types/onlineBooking';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  booking: OnlineBooking;
  businessProfile: PublicBusinessProfile;
  staffProfile?: PublicStaffProfile & { staff: any };
  serviceProfile?: PublicServiceProfile & { services: any };
  onBookAnother: () => void;
}

export const BookingConfirmation = ({
  booking,
  businessProfile,
  staffProfile,
  serviceProfile,
  onBookAnother
}: BookingConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Thank You For Your Booking!
          </CardTitle>
          <p className="text-green-600">
            Your appointment has been successfully submitted and is pending confirmation.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Booking Reference</h4>
              <p className="font-mono text-lg">{booking.bookingReference}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Status</h4>
              <p className="capitalize">{booking.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Service Details</h4>
            <div className="space-y-2">
              <p><strong>Service:</strong> {serviceProfile?.displayName}</p>
              <p><strong>Staff:</strong> {staffProfile?.displayName}</p>
              <p><strong>Date:</strong> {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</p>
              <p><strong>Duration:</strong> {serviceProfile?.services.duration} minutes</p>
              {serviceProfile?.services.price && (
                <p><strong>Price:</strong> ${serviceProfile.services.price}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
            <div className="space-y-1">
              <p><strong>Name:</strong> {booking.customerName}</p>
              <p><strong>Email:</strong> {booking.customerEmail}</p>
              {booking.customerPhone && (
                <p><strong>Phone:</strong> {booking.customerPhone}</p>
              )}
              {booking.customerNotes && (
                <div>
                  <p><strong>Special Requests:</strong></p>
                  <p className="text-gray-600">{booking.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You will receive a confirmation email shortly</li>
              <li>• We will review your booking and confirm within 24 hours</li>
              <li>• You'll receive a reminder before your appointment</li>
              <li>• Keep your booking reference for your records</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
            <div className="space-y-1 text-sm">
              {businessProfile.contactPhone && (
                <p>📞 {businessProfile.contactPhone}</p>
              )}
              {businessProfile.contactEmail && (
                <p>✉️ {businessProfile.contactEmail}</p>
              )}
              {businessProfile.address && (
                <p>📍 {businessProfile.address}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={onBookAnother} className="w-full md:w-auto">
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

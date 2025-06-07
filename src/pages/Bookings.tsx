
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';
import { useBookings } from '@/hooks/useBookings';
import { BookingCard } from '@/components/bookings/BookingCard';
import { useTenant } from '@/contexts/TenantContext';

const Bookings = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  const { data: bookings, isLoading } = useBookings(tenantId || '');

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          {tenantError || 'No tenant access found. Please contact support.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage customer appointments and bookings</p>
        </div>
        <NewBookingDialog />
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search bookings..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>No bookings found</p>
                <p className="text-sm mt-2">Create your first booking to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookings;

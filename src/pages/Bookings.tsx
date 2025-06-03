import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    serviceName: 'Haircut & Style',
    staffName: 'Sarah Wilson',
    date: '2024-06-05',
    time: '10:00 AM',
    status: 'confirmed',
    duration: '60 min',
    price: '$45'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    serviceName: 'Color Treatment',
    staffName: 'Mike Johnson',
    date: '2024-06-05',
    time: '2:00 PM',
    status: 'pending',
    duration: '120 min',
    price: '$120'
  },
  {
    id: '3',
    customerName: 'Bob Brown',
    serviceName: 'Beard Trim',
    staffName: 'Sarah Wilson',
    date: '2024-06-06',
    time: '9:30 AM',
    status: 'completed',
    duration: '30 min',
    price: '$25'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Bookings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600">Manage customer appointments and bookings</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
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
          {mockBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                      <p className="text-gray-600">{booking.serviceName}</p>
                      <p className="text-sm text-gray-500">with {booking.staffName}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="font-medium">{booking.date} at {booking.time}</p>
                      <p className="text-sm text-gray-500">{booking.duration} • {booking.price}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;

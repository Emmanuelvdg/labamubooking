import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingCard } from '@/components/bookings/BookingCard';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, DollarSign, Plus } from 'lucide-react';
import { Booking } from '@/types';

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    tenantId: 'tenant1',
    customerId: 'customer1',
    staffId: 'staff1',
    serviceId: 'service1',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    customer: { id: 'customer1', tenantId: 'tenant1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1234567890' },
    staff: { id: 'staff1', tenantId: 'tenant1', name: 'Mike Chen', email: 'mike@email.com', role: 'Stylist', skills: ['Hair Cut', 'Color'], isActive: true },
    service: { id: 'service1', tenantId: 'tenant1', name: 'Hair Cut & Style', description: 'Professional haircut with styling', duration: 60, price: 65 }
  },
  {
    id: '2',
    tenantId: 'tenant1',
    customerId: 'customer2',
    staffId: 'staff2',
    serviceId: 'service2',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    customer: { id: 'customer2', tenantId: 'tenant1', name: 'David Wilson', email: 'david@email.com', phone: '+1234567891' },
    staff: { id: 'staff2', tenantId: 'tenant1', name: 'Lisa Park', email: 'lisa@email.com', role: 'Massage Therapist', skills: ['Deep Tissue', 'Relaxation'], isActive: true },
    service: { id: 'service2', tenantId: 'tenant1', name: 'Deep Tissue Massage', description: 'Therapeutic deep tissue massage', duration: 90, price: 120 }
  }
];

const Dashboard = () => {
  return (
    <Layout tenantName="Bella Vista Spa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your business overview.</p>
          </div>
          <NewBookingDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Today's Bookings"
            value={12}
            icon={BookOpen}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Customers"
            value="1,247"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="This Month Revenue"
            value="$24,580"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Upcoming This Week"
            value={48}
            icon={Calendar}
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Bookings
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Staff
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Service Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

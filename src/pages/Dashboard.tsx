
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingCard } from '@/components/bookings/BookingCard';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, DollarSign, Plus } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useCustomers } from '@/hooks/useCustomers';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  
  const { data: bookings = [] } = useBookings(tenantId || '');
  const { data: customers = [] } = useCustomers(tenantId || '');
  const { data: services = [] } = useServices(tenantId || '');

  // Fetch tenant information
  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      if (!tenantId) return null;
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  if (tenantLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">
            {tenantError || 'No tenant access found. Please contact support.'}
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate stats from real data only
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  
  const todaysBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= todayStart && bookingDate < todayEnd;
  });

  // Calculate this month's revenue from completed bookings only
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);
  
  const thisMonthCompletedBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return booking.status === 'completed' && 
           bookingDate >= monthStart && 
           bookingDate <= monthEnd;
  });
  
  const monthlyRevenue = thisMonthCompletedBookings.reduce((total, booking) => 
    total + booking.service.price, 0
  );

  // Calculate upcoming bookings this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  const upcomingThisWeek = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= today && bookingDate <= weekEnd;
  });

  // Get upcoming bookings for the card
  const upcomingBookings = bookings
    .filter(booking => new Date(booking.startTime) > today)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <Layout tenantName={tenant?.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your business overview.</p>
          </div>
          <NewBookingDialog />
        </div>

        {/* Stats Cards - all data comes from database */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Today's Bookings"
            value={todaysBookings.length}
            icon={BookOpen}
          />
          <StatsCard
            title="Total Customers"
            value={customers.length.toLocaleString()}
            icon={Users}
          />
          <StatsCard
            title="This Month Revenue"
            value={formatCurrency(monthlyRevenue)}
            icon={DollarSign}
          />
          <StatsCard
            title="Upcoming This Week"
            value={upcomingThisWeek.length}
            icon={Calendar}
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
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
              )}
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

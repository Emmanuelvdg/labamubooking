
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID');

      console.log('Fetching dashboard statistics for tenant:', tenantId);

      // Fetch customers count
      const { count: customersCount, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      if (customersError) throw customersError;

      // Fetch bookings count for this month
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

      const { count: bookingsCount, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('start_time', firstDayOfMonth.toISOString())
        .lte('start_time', lastDayOfMonth.toISOString());

      if (bookingsError) throw bookingsError;

      // Fetch completed bookings with service prices for revenue calculation
      const { data: completedBookings, error: revenueError } = await supabase
        .from('bookings')
        .select(`
          id,
          service:services(price)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'completed')
        .gte('start_time', firstDayOfMonth.toISOString())
        .lte('start_time', lastDayOfMonth.toISOString());

      if (revenueError) throw revenueError;

      // Calculate total revenue
      const totalRevenue = completedBookings?.reduce((sum, booking) => {
        return sum + (booking.service?.price || 0);
      }, 0) || 0;

      // Calculate growth percentage (simplified - comparing to last month)
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const lastMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0, 23, 59, 59);

      const { count: lastMonthBookings, error: lastMonthError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('start_time', lastMonth.toISOString())
        .lte('start_time', lastMonthEnd.toISOString());

      if (lastMonthError) throw lastMonthError;

      const growthPercentage = lastMonthBookings && lastMonthBookings > 0 
        ? Math.round(((bookingsCount || 0) - lastMonthBookings) / lastMonthBookings * 100)
        : bookingsCount || 0 > 0 ? 100 : 0;

      console.log('Dashboard stats calculated:', {
        customersCount,
        bookingsCount,
        totalRevenue,
        growthPercentage
      });

      return {
        customersCount: customersCount || 0,
        bookingsCount: bookingsCount || 0,
        totalRevenue,
        growthPercentage
      };
    },
    enabled: !!tenantId,
  });

  // Fetch recent activity (recent bookings)
  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recent-bookings', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID');

      console.log('Fetching recent bookings for tenant:', tenantId);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          start_time,
          customer:customers(name),
          service:services(name, price)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      console.log('Recent bookings fetched:', data);
      return data || [];
    },
    enabled: !!tenantId,
  });

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard...</div>
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'confirmed': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getActivityText = (booking: any) => {
    const customerName = booking.customer?.name || 'Unknown customer';
    const serviceName = booking.service?.name || 'Unknown service';
    
    switch (booking.status) {
      case 'completed':
        return `Payment received - ${formatCurrency(booking.service?.price || 0)}`;
      case 'confirmed':
        return `Confirmed booking: ${customerName} for ${serviceName}`;
      case 'pending':
        return `New booking from ${customerName}`;
      case 'cancelled':
        return `Booking cancelled: ${customerName}`;
      default:
        return `Booking update: ${customerName}`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {statsLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading statistics...</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Customers"
            value={stats?.customersCount || 0}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="This Month's Bookings"
            value={stats?.bookingsCount || 0}
            icon={Calendar}
            trend={{ value: Math.abs(stats?.growthPercentage || 0), isPositive: (stats?.growthPercentage || 0) >= 0 }}
          />
          <StatsCard
            title="Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Growth"
            value={`${stats?.growthPercentage || 0}%`}
            icon={TrendingUp}
            trend={{ value: Math.abs(stats?.growthPercentage || 0), isPositive: (stats?.growthPercentage || 0) >= 0 }}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and customer activity</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="text-center text-gray-500">Loading activity...</div>
            ) : recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(booking.status)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{getActivityText(booking)}</p>
                      <p className="text-xs text-gray-600">{formatTimeAgo(booking.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No recent activity</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">Create New Booking</div>
                <div className="text-sm text-gray-600">Schedule a new appointment</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">Add New Customer</div>
                <div className="text-sm text-gray-600">Register a new client</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium">View Calendar</div>
                <div className="text-sm text-gray-600">Check today's schedule</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Clock, TrendingUp, UserCheck, MapPin, Phone } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useTenantDetails } from '@/hooks/useTenantDetails';

const Dashboard = () => {
  const { data: tenant } = useTenantDetails();
  const { currentTenantRole } = useTenant();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600">Welcome back to your business dashboard</p>
              {currentTenantRole && (
                <Badge variant="outline" className="text-xs">
                  {currentTenantRole}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {tenant && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tenant.name}</CardTitle>
                  <CardDescription>{tenant.business_type}</CardDescription>
                </div>
                <Badge variant="secondary">{tenant.business_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Owner: {tenant.owner_name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{tenant.phone || 'No phone number'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{tenant.email}</span>
                  </div>
                  {tenant.description && (
                    <p className="text-sm text-gray-600">{tenant.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Bookings"
            value="12"
            description="+2 from yesterday"
            icon={Calendar}
            trend="up"
          />
          <StatsCard
            title="Active Customers"
            value="248"
            description="+12 this week"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Revenue (This Month)"
            value="$3,240"
            description="+8% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Avg. Session Time"
            value="2.4h"
            description="+0.2h from last month"
            icon={Clock}
            trend="up"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New booking - Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Haircut & Style - Tomorrow 2:00 PM</p>
                  </div>
                  <Badge variant="outline">New</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment received - $85</p>
                    <p className="text-sm text-gray-600">From Michael Chen - Color Treatment</p>
                  </div>
                  <Badge variant="secondary">Paid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking cancelled</p>
                    <p className="text-sm text-gray-600">Emma Davis - Today 4:00 PM</p>
                  </div>
                  <Badge variant="destructive">Cancelled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Staff Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Jessica Parker</p>
                    <p className="text-sm text-gray-600">8 bookings today</p>
                  </div>
                  <Badge variant="default">Top Performer</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alex Rodriguez</p>
                    <p className="text-sm text-gray-600">6 bookings today</p>
                  </div>
                  <Badge variant="secondary">Good</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-gray-600">4 bookings today</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">94%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">$12,450</p>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

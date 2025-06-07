
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const AnalyticsDemo = () => {
  const stats = [
    { label: "Total Revenue", value: "$12,450", change: "+12%", trend: "up" },
    { label: "Appointments", value: "156", change: "+8%", trend: "up" },
    { label: "New Customers", value: "23", change: "+15%", trend: "up" },
    { label: "Average Service", value: "$79.80", change: "-2%", trend: "down" }
  ];

  const topServices = [
    { name: "Hair Cut & Style", bookings: 45, revenue: "$3,825" },
    { name: "Deep Tissue Massage", bookings: 32, revenue: "$3,840" },
    { name: "Facial Treatment", bookings: 28, revenue: "$2,660" },
    { name: "Color Treatment", bookings: 18, revenue: "$2,700" }
  ];

  const staffPerformance = [
    { name: "Emma Wilson", appointments: 48, revenue: "$4,080", rating: 4.9 },
    { name: "David Chen", appointments: 35, revenue: "$4,200", rating: 4.8 },
    { name: "Sarah Miller", appointments: 32, revenue: "$2,880", rating: 4.9 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">LabamuBooking</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/demo" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Demo
                </Link>
              </Button>
              <Button asChild>
                <Link to="/tenant/create">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Demo: Analytics & Reports
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Business Intelligence Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make data-driven decisions with comprehensive analytics and reporting tools.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className={`h-4 w-4 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue growth over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-end justify-center p-4">
                <div className="flex items-end space-x-2 h-full">
                  {[65, 75, 85, 70, 90, 100].map((height, index) => (
                    <div
                      key={index}
                      className="bg-blue-600 rounded-t-sm flex-1 max-w-8"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Consistent growth with 12% increase this month
              </div>
            </CardContent>
          </Card>

          {/* Booking Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Most popular services this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{service.name}</span>
                        <span className="text-sm text-gray-600">{service.bookings} bookings</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(service.bookings / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-semibold text-green-600">{service.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Staff Member</th>
                  <th className="text-center py-3 px-4">Appointments</th>
                  <th className="text-center py-3 px-4">Revenue</th>
                  <th className="text-center py-3 px-4">Rating</th>
                  <th className="text-center py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{staff.name}</td>
                    <td className="py-3 px-4 text-center">{staff.appointments}</td>
                    <td className="py-3 px-4 text-center font-medium text-green-600">{staff.revenue}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">⭐ {staff.rating}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              <CardDescription>Track revenue trends, peaks, and growth patterns</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Customer Insights</CardTitle>
              <CardDescription>Analyze customer behavior, retention, and satisfaction</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <CardDescription>Monitor staff performance and service efficiency</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Financial Reports</CardTitle>
              <CardDescription>Generate detailed financial reports and forecasts</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Report Types */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Revenue Reports</CardTitle>
                <CardDescription>Daily, weekly, monthly, and annual revenue analysis</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Customer Reports</CardTitle>
                <CardDescription>Customer acquisition, retention, and lifetime value</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg">Service Reports</CardTitle>
                <CardDescription>Service popularity, pricing analysis, and optimization</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg">Staff Reports</CardTitle>
                <CardDescription>Individual and team performance metrics</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-lg">Booking Reports</CardTitle>
                <CardDescription>Appointment trends, no-shows, and utilization rates</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-lg">Financial Reports</CardTitle>
                <CardDescription>P&L statements, tax reports, and expense tracking</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Start Making Data-Driven Decisions</CardTitle>
              <CardDescription>
                Get insights that help you grow your business with our analytics platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link to="/tenant/create">Create Your Business Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDemo;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Users, Settings, BarChart3, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Demo = () => {
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
                <Link to="/">Back to Home</Link>
              </Button>
              <Button asChild>
                <Link to="/tenant/create">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Platform Demo
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
            Explore Our Features
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See how LabamuBooking can transform your service business with our comprehensive suite of tools.
          </p>
        </div>

        {/* Demo Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/bookings">
              <CardHeader>
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Streamline appointment scheduling with intelligent booking management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/calendar">
              <CardHeader>
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  Visualize all appointments and staff schedules in one comprehensive calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/staff">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  Manage team schedules, roles, and availability with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/services">
              <CardHeader>
                <Settings className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Service Management</CardTitle>
                <CardDescription>
                  Organize services, pricing, and categories for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/commissions">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Commission Schemes</CardTitle>
                <CardDescription>
                  Track and manage staff commissions with flexible schemes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/demo/analytics">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Gain insights with comprehensive reporting and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Create your business account and start managing appointments today
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" asChild>
                <Link to="/tenant/create">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Demo;

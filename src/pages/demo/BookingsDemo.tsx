
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const BookingsDemo = () => {
  const sampleBookings = [
    {
      id: 1,
      customer: "Sarah Johnson",
      service: "Hair Cut & Style",
      staff: "Emma Wilson",
      time: "10:00 AM",
      date: "Today",
      status: "confirmed",
      duration: "60 min",
      price: "$85"
    },
    {
      id: 2,
      customer: "Michael Brown",
      service: "Deep Tissue Massage",
      staff: "David Chen",
      time: "2:30 PM",
      date: "Today",
      status: "pending",
      duration: "90 min",
      price: "$120"
    },
    {
      id: 3,
      customer: "Lisa Davis",
      service: "Facial Treatment",
      staff: "Emma Wilson",
      time: "11:00 AM",
      date: "Tomorrow",
      status: "confirmed",
      duration: "75 min",
      price: "$95"
    }
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
            Demo: Booking Management
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Streamlined Booking Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage all your appointments in one place with intelligent scheduling, conflict detection, and automated reminders.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Scheduling</CardTitle>
              <CardDescription>Automatic conflict detection and optimal time slot suggestions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Updates</CardTitle>
              <CardDescription>Instant notifications for booking changes and cancellations</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Customer Management</CardTitle>
              <CardDescription>Complete customer profiles with booking history and preferences</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sample Bookings */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Bookings</h2>
            <Badge variant="outline">3 appointments</Badge>
          </div>
          
          <div className="space-y-4">
            {sampleBookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{booking.customer}</h3>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                          className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{booking.service}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {booking.staff}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.time} ({booking.duration})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{booking.price}</p>
                      <p className="text-sm text-gray-500">{booking.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Start Managing Your Bookings</CardTitle>
              <CardDescription>
                Join thousands of businesses using LabamuBooking to streamline their operations
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

export default BookingsDemo;

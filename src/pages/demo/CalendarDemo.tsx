
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, Calendar, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarDemo = () => {
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];
  const staff = ['Emma Wilson', 'David Chen', 'Sarah Miller'];
  
  const appointments = [
    { staff: 'Emma Wilson', time: '10:00', duration: 2, customer: 'Sarah J.', service: 'Hair Cut' },
    { staff: 'Emma Wilson', time: '2:00', duration: 1, customer: 'Mike B.', service: 'Beard Trim' },
    { staff: 'David Chen', time: '9:00', duration: 3, customer: 'Lisa D.', service: 'Massage' },
    { staff: 'David Chen', time: '1:00', duration: 2, customer: 'Tom W.', service: 'Therapy' },
    { staff: 'Sarah Miller', time: '11:00', duration: 2, customer: 'Anna K.', service: 'Facial' },
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
            Demo: Calendar View
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Comprehensive Calendar Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize all appointments, staff schedules, and availability in one intuitive calendar interface.
          </p>
        </div>

        {/* Calendar Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
            <div className="flex space-x-2">
              <Badge>5 appointments</Badge>
              <Badge variant="outline">3 staff members</Badge>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 min-w-[800px]">
              {/* Header */}
              <div className="font-semibold text-gray-700 p-2">Time</div>
              {staff.map((staffMember) => (
                <div key={staffMember} className="font-semibold text-gray-700 p-2 text-center">
                  {staffMember}
                </div>
              ))}
              
              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="contents">
                  <div className="p-2 text-sm text-gray-600 border-t">{time}</div>
                  {staff.map((staffMember) => {
                    const appointment = appointments.find(
                      apt => apt.staff === staffMember && apt.time === time
                    );
                    
                    return (
                      <div key={`${staffMember}-${time}`} className="p-1 border-t min-h-[60px]">
                        {appointment && (
                          <div 
                            className="bg-blue-100 border-l-4 border-l-blue-500 p-2 rounded text-xs"
                            style={{ height: `${appointment.duration * 60}px` }}
                          >
                            <div className="font-semibold">{appointment.customer}</div>
                            <div className="text-gray-600">{appointment.service}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Multi-View Calendar</CardTitle>
              <CardDescription>Switch between day, week, and month views to get the perspective you need</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Staff Scheduling</CardTitle>
              <CardDescription>View all staff schedules simultaneously to optimize resource allocation</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Availability Tracking</CardTitle>
              <CardDescription>Real-time availability updates and conflict prevention</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Experience the Full Calendar</CardTitle>
              <CardDescription>
                Create your account to access the complete calendar management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link to="/tenant/create">Start Your Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarDemo;

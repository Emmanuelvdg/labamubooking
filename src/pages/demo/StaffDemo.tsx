
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, Users, Shield, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";

const StaffDemo = () => {
  const staffMembers = [
    {
      id: 1,
      name: "Emma Wilson",
      role: "Senior Stylist",
      avatar: "EW",
      skills: ["Hair Cut", "Color", "Styling"],
      rating: 4.9,
      experience: "5 years",
      status: "available"
    },
    {
      id: 2,
      name: "David Chen",
      role: "Massage Therapist",
      avatar: "DC",
      skills: ["Deep Tissue", "Swedish", "Hot Stone"],
      rating: 4.8,
      experience: "3 years",
      status: "busy"
    },
    {
      id: 3,
      name: "Sarah Miller",
      role: "Esthetician",
      avatar: "SM",
      skills: ["Facial", "Skin Care", "Microdermabrasion"],
      rating: 4.9,
      experience: "4 years",
      status: "available"
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
            Demo: Staff Management
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Comprehensive Staff Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your team efficiently with role-based permissions, schedule tracking, and performance insights.
          </p>
        </div>

        {/* Staff Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-semibold text-blue-600">{staff.avatar}</span>
                </div>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mb-2">{staff.role}</Badge>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{staff.rating}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {staff.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{staff.experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge 
                      variant={staff.status === 'available' ? 'default' : 'secondary'}
                      className={staff.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {staff.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Team Overview</CardTitle>
              <CardDescription>Manage all staff members from a centralized dashboard</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Role Management</CardTitle>
              <CardDescription>Create custom roles with specific permissions and access levels</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Schedule Tracking</CardTitle>
              <CardDescription>Monitor availability, working hours, and time-off requests</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Performance Insights</CardTitle>
              <CardDescription>Track ratings, completed appointments, and customer feedback</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Role Management Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Role-Based Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Manager</CardTitle>
                <CardDescription>Full access to all features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage bookings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage staff</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>View reports</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage settings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Staff</CardTitle>
                <CardDescription>Standard staff permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>View own schedule</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage own bookings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>Manage other staff</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>Access settings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-lg">Receptionist</CardTitle>
                <CardDescription>Front desk operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage bookings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>View all schedules</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Manage customers</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>Manage staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Build Your Team</CardTitle>
              <CardDescription>
                Start managing your staff more effectively with LabamuBooking
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

export default StaffDemo;

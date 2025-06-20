
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Book, 
  Users, 
  Calendar, 
  Settings, 
  UserCheck, 
  Clock, 
  DollarSign, 
  BarChart3,
  Building2
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Guide</h1>
        <p className="text-gray-600">Complete guide to using LabamuBooking</p>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started" className="flex items-center">
            <Book className="h-4 w-4 mr-2" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="core-features" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Core Features
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Welcome to LabamuBooking
              </CardTitle>
              <CardDescription>
                Your comprehensive service management and booking system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">System Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Internet connection</li>
                  <li>Valid email address</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Quick Setup Checklist</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Create your business account and profile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Set up service categories and services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Create staff roles and add team members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Set up staff schedules</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Configure commission schemes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account and Business Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Creating Your First Business</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Navigate to the LabamuBooking website</li>
                  <li>Click on "Create Your Business Account"</li>
                  <li>Fill in your business details (name, type, description)</li>
                  <li>Enter contact information (owner name, email, phone)</li>
                  <li>Create secure account credentials</li>
                  <li>Review and submit your registration</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Multi-Business Support</h4>
                <p className="text-blue-700 text-sm">
                  LabamuBooking supports multiple businesses under one account. Each business operates 
                  independently with its own staff, services, customers, and bookings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="core-features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Booking Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Creating Bookings</h4>
                  <p className="text-sm text-gray-600">
                    Easily create new bookings by selecting customers, services, staff, and time slots.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Status Management</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pending</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Confirmed</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Completed</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Cancelled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Calendar & Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Multiple Views</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Monthly overview of all appointments</li>
                    <li>• Weekly detailed planning view</li>
                    <li>• Daily hour-by-hour schedule</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Conflict Detection</h4>
                  <p className="text-sm text-gray-600">
                    Automatic detection of scheduling conflicts and double-bookings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Service Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Service Categories</h4>
                  <p className="text-sm text-gray-600">
                    Organize services into themed categories with color coding for easy identification.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Service Details</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name and description</li>
                    <li>• Duration and pricing</li>
                    <li>• Category assignment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Customer Profiles</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Contact information</li>
                    <li>• Booking history</li>
                    <li>• Preferences and notes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Customer Sync</h4>
                  <p className="text-sm text-gray-600">
                    Integration with external systems for automatic data import.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Staff Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Staff Roles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Admin</span>
                      <span className="text-sm text-gray-600">Full system access</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Manager</span>
                      <span className="text-sm text-gray-600">Staff & booking management</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Staff</span>
                      <span className="text-sm text-gray-600">Own schedule & bookings</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Schedule Management</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Regular working hours</li>
                    <li>• Exception handling</li>
                    <li>• Recurring patterns</li>
                    <li>• Coverage and substitutions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Commission System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Commission Types</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 rounded">
                      <span className="font-medium text-green-800">Percentage</span>
                      <p className="text-sm text-green-700">Commission as % of service price</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <span className="font-medium text-blue-800">Fixed Amount</span>
                      <p className="text-sm text-blue-700">Fixed amount per service</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Automatic Tracking</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Commission calculation on completion</li>
                    <li>• Payment status tracking</li>
                    <li>• Detailed commission reports</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Online Booking Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Business Profile</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Business information and branding</li>
                    <li>• Logo and cover images</li>
                    <li>• SEO settings</li>
                    <li>• Social media links</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Booking Configuration</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Advance booking limits</li>
                    <li>• Customer requirements</li>
                    <li>• Confirmation settings</li>
                    <li>• Cancellation policies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Automated Reminders</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Booking confirmations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Appointment reminders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Follow-up messages</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Message Templates</h4>
                  <p className="text-sm text-gray-600">
                    Personalized templates with customer name, service details, and appointment information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dashboard Analytics
              </CardTitle>
              <CardDescription>
                Real-time insights into your business performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-sm text-blue-700">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$12,345</div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-purple-700">Active Staff</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">567</div>
                  <div className="text-sm text-orange-700">Customers</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Business Intelligence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Capacity Planning</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Analyze busy periods for staff scheduling</li>
                      <li>• Identify peak days and times</li>
                      <li>• Optimize service availability</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Service Optimization</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Track most popular services</li>
                      <li>• Adjust pricing based on demand</li>
                      <li>• Plan service expansions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">✓ Do</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Keep staff schedules current</li>
                    <li>• Confirm bookings promptly</li>
                    <li>• Maintain detailed customer information</li>
                    <li>• Use automated reminders</li>
                    <li>• Review commission structures regularly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-red-700">⚠ Avoid</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Neglecting schedule updates</li>
                    <li>• Incomplete customer profiles</li>
                    <li>• Ignoring booking conflicts</li>
                    <li>• Manual processes that can be automated</li>
                    <li>• Unclear role definitions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserGuide;

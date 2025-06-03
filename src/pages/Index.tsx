
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Users, BarChart3, Clock, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent booking system that prevents double-bookings and optimizes staff time.'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Comprehensive customer profiles with booking history and preferences.'
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Real-time insights into revenue, popular services, and staff performance.'
    },
    {
      icon: Clock,
      title: 'Staff Scheduling',
      description: 'Efficient staff assignment and availability management for optimal service delivery.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            BookingPro
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            The Complete Booking & Reservation Management Platform
          </p>
          <p className="text-xl text-gray-500 mb-8 max-w-3xl mx-auto">
            Streamline your service business with intelligent scheduling, staff management, 
            and customer relationship tools. Built for salons, spas, clinics, and service professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={() => window.location.href = '/tenant/create'}
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => window.location.href = '/dashboard'}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Service Businesses Choose BookingPro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
              <div className="text-gray-600">Increase in Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50%</div>
              <div className="text-gray-600">Time Saved on Admin</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of service businesses already using BookingPro
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => window.location.href = '/tenant/create'}
          >
            Get Started Today - It's Free!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

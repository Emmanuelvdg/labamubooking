
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, Scissors, Palette, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesDemo = () => {
  const serviceCategories = [
    {
      name: "Hair Services",
      color: "bg-blue-100 text-blue-800",
      icon: Scissors,
      services: [
        { name: "Hair Cut", duration: "30 min", price: "$45" },
        { name: "Hair Cut & Style", duration: "60 min", price: "$85" },
        { name: "Color Treatment", duration: "120 min", price: "$150" },
        { name: "Highlights", duration: "180 min", price: "$200" }
      ]
    },
    {
      name: "Spa Services",
      color: "bg-green-100 text-green-800",
      icon: Palette,
      services: [
        { name: "Facial Treatment", duration: "75 min", price: "$95" },
        { name: "Deep Tissue Massage", duration: "90 min", price: "$120" },
        { name: "Hot Stone Massage", duration: "60 min", price: "$100" },
        { name: "Aromatherapy", duration: "45 min", price: "$80" }
      ]
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
            Demo: Service Management
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Organize Your Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your service offerings, pricing, and categories with our intuitive service management system.
          </p>
        </div>

        {/* Service Categories */}
        <div className="space-y-8 mb-12">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mr-4">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <Badge className={category.color}>{category.services.length} services</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Duration
                            </span>
                            <span className="font-medium">{service.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Price
                            </span>
                            <span className="font-medium text-green-600">{service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Palette className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Category Management</CardTitle>
              <CardDescription>Organize services into logical categories with custom colors and icons</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Duration Tracking</CardTitle>
              <CardDescription>Set accurate service durations for optimal scheduling</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Flexible Pricing</CardTitle>
              <CardDescription>Manage pricing with support for different rates and promotions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Scissors className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Service Details</CardTitle>
              <CardDescription>Add descriptions, requirements, and staff assignments</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Service Management Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Service Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Service Configuration</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Custom service descriptions and requirements
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Staff skill matching and assignments
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Equipment and resource requirements
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Preparation and cleanup time settings
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Pricing & Packages</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Dynamic pricing based on demand
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Service packages and bundles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Membership and loyalty discounts
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Seasonal promotions and offers
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Start Managing Your Services</CardTitle>
              <CardDescription>
                Set up your service catalog and start taking bookings today
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

export default ServicesDemo;

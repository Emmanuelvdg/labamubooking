
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, CreditCard, TrendingUp, DollarSign, Percent } from "lucide-react";
import { Link } from "react-router-dom";

const CommissionsDemo = () => {
  const commissionSchemes = [
    {
      name: "Senior Staff",
      type: "Percentage",
      rate: "60%",
      description: "High performers with 3+ years experience",
      staff: ["Emma Wilson", "David Chen"],
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Standard Staff",
      type: "Percentage",
      rate: "45%",
      description: "Regular staff members",
      staff: ["Sarah Miller", "Mike Johnson"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "New Hires",
      type: "Fixed",
      rate: "$25/service",
      description: "Training period commission",
      staff: ["Alex Thompson"],
      color: "bg-yellow-100 text-yellow-800"
    }
  ];

  const sampleEarnings = [
    { staff: "Emma Wilson", services: 12, revenue: "$1,080", commission: "$648", rate: "60%" },
    { staff: "David Chen", services: 8, revenue: "$960", commission: "$576", rate: "60%" },
    { staff: "Sarah Miller", services: 10, revenue: "$750", commission: "$338", rate: "45%" },
    { staff: "Mike Johnson", services: 6, revenue: "$480", commission: "$216", rate: "45%" }
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
            Demo: Commission Management
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Flexible Commission Schemes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create custom commission structures, track earnings, and motivate your team with transparent compensation.
          </p>
        </div>

        {/* Commission Schemes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commissionSchemes.map((scheme, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <Badge className={scheme.color}>{scheme.type}</Badge>
                  </div>
                  <CardDescription>{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{scheme.rate}</div>
                      <div className="text-sm text-gray-600">Commission Rate</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Assigned Staff:</p>
                      <div className="space-y-1">
                        {scheme.staff.map((staffMember, staffIndex) => (
                          <Badge key={staffIndex} variant="outline" className="mr-1">
                            {staffMember}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Earnings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Staff Member</th>
                  <th className="text-center py-3 px-4">Services</th>
                  <th className="text-center py-3 px-4">Revenue</th>
                  <th className="text-center py-3 px-4">Rate</th>
                  <th className="text-center py-3 px-4">Commission</th>
                </tr>
              </thead>
              <tbody>
                {sampleEarnings.map((earning, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{earning.staff}</td>
                    <td className="py-3 px-4 text-center">{earning.services}</td>
                    <td className="py-3 px-4 text-center font-medium">{earning.revenue}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{earning.rate}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-green-600">{earning.commission}</td>
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
              <Percent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Flexible Rates</CardTitle>
              <CardDescription>Set percentage or fixed commission rates for different roles</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Performance Tracking</CardTitle>
              <CardDescription>Monitor individual and team performance with detailed analytics</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Automated Calculations</CardTitle>
              <CardDescription>Real-time commission calculations with every completed service</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Payment Integration</CardTitle>
              <CardDescription>Seamless integration with payroll and payment systems</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Commission Types */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Structure Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Percentage-Based</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Service revenue percentage (e.g., 50%)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Tiered rates based on performance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Different rates per service category
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Bonus percentages for targets
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Fixed Amount</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Fixed amount per service completed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Different amounts per service type
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Hourly commission rates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Performance bonuses and incentives
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Start Tracking Commissions</CardTitle>
              <CardDescription>
                Motivate your team with transparent and fair commission tracking
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

export default CommissionsDemo;

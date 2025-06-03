import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockStaff = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@bookingpro.com',
    role: 'Senior Stylist',
    skills: ['Haircuts', 'Coloring', 'Styling'],
    avatar: '',
    isActive: true,
    rating: 4.8,
    totalBookings: 156
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@bookingpro.com',
    role: 'Color Specialist',
    skills: ['Color Treatment', 'Highlights', 'Balayage'],
    avatar: '',
    isActive: true,
    rating: 4.9,
    totalBookings: 143
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@bookingpro.com',
    role: 'Junior Stylist',
    skills: ['Haircuts', 'Blowouts', 'Basic Styling'],
    avatar: '',
    isActive: false,
    rating: 4.6,
    totalBookings: 89
  }
];

const Staff = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
            <p className="text-gray-600">Manage your team members and their skills</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search staff..." className="pl-10" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockStaff.map((staff) => (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback>
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg truncate">{staff.name}</h3>
                      <Badge variant={staff.isActive ? "default" : "secondary"}>
                        {staff.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium">{staff.role}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {staff.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span className="font-medium">{staff.rating}</span>
                        </div>
                        <span className="text-gray-500">{staff.totalBookings} bookings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Staff;

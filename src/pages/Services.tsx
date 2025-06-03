import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockServices = [
  {
    id: '1',
    name: 'Haircut & Style',
    description: 'Professional haircut with styling',
    duration: 60,
    price: 45,
    category: 'Hair Services'
  },
  {
    id: '2',
    name: 'Color Treatment',
    description: 'Full hair coloring service',
    duration: 120,
    price: 120,
    category: 'Color Services'
  },
  {
    id: '3',
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    duration: 30,
    price: 25,
    category: 'Grooming'
  },
  {
    id: '4',
    name: 'Highlights',
    description: 'Partial hair highlighting',
    duration: 90,
    price: 85,
    category: 'Color Services'
  },
  {
    id: '5',
    name: 'Blowout',
    description: 'Professional hair washing and styling',
    duration: 45,
    price: 35,
    category: 'Hair Services'
  },
  {
    id: '6',
    name: 'Deep Conditioning',
    description: 'Intensive hair treatment and conditioning',
    duration: 30,
    price: 40,
    category: 'Hair Treatment'
  }
];

const Services = () => {
  const categories = [...new Set(mockServices.map(service => service.category))];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600">Manage your service offerings and pricing</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search services..." className="pl-10" />
          </div>
        </div>

        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockServices
                .filter(service => service.category === category)
                .map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{service.duration} minutes</span>
                          </div>
                          <div className="flex items-center text-lg font-semibold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="w-fit">
                          {service.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Services;

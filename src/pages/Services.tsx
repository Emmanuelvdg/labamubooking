
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewServiceDialog } from '@/components/services/NewServiceDialog';
import { useServices } from '@/hooks/useServices';

const Services = () => {
  // Using the same UUID format as in other pages
  const tenantId = '00000000-0000-0000-0000-000000000001';
  const { data: services, isLoading } = useServices(tenantId);

  // Group services by a simple categorization based on service name
  const categorizeServices = (services: any[]) => {
    const categories: { [key: string]: any[] } = {};
    
    services.forEach(service => {
      let category = 'General Services';
      
      // Simple categorization logic based on service name
      const name = service.name.toLowerCase();
      if (name.includes('hair') || name.includes('cut') || name.includes('style')) {
        category = 'Hair Services';
      } else if (name.includes('color') || name.includes('highlight')) {
        category = 'Color Services';
      } else if (name.includes('beard') || name.includes('trim')) {
        category = 'Grooming';
      } else if (name.includes('treatment') || name.includes('condition')) {
        category = 'Hair Treatment';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(service);
    });
    
    return categories;
  };

  const categorizedServices = services ? categorizeServices(services) : {};
  const categories = Object.keys(categorizedServices);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600">Manage your service offerings and pricing</p>
          </div>
          <NewServiceDialog />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search services..." className="pl-10" />
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Loading services...</p>
            </CardContent>
          </Card>
        ) : services && services.length > 0 ? (
          categories.map(category => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorizedServices[category].map((service) => (
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
                          {category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>No services found</p>
                <p className="text-sm mt-2">Create your first service to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Services;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewServiceDialog } from '@/components/services/NewServiceDialog';
import { ManageCategoriesDialog } from '@/components/services/ManageCategoriesDialog';
import { EditServiceDialog } from '@/components/services/EditServiceDialog';
import { DeleteServiceDialog } from '@/components/services/DeleteServiceDialog';
import { SyncServicesButton } from '@/components/services/SyncServicesButton';
import { useServices } from '@/hooks/useServices';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useTenant } from '@/contexts/TenantContext';

const Services = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  const { data: services, isLoading } = useServices(tenantId || '');
  const { data: categories } = useServiceCategories(tenantId || '');

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading services...</div>
      </div>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          {tenantError || 'No tenant access found. Please contact support.'}
        </div>
      </div>
    );
  }

  // Group services by their actual categories
  const categorizeServices = (services: any[]) => {
    const categorizedServices: { [key: string]: any[] } = {};
    const uncategorizedServices: any[] = [];
    
    services.forEach(service => {
      if (service.category) {
        const categoryName = service.category.name;
        if (!categorizedServices[categoryName]) {
          categorizedServices[categoryName] = [];
        }
        categorizedServices[categoryName].push(service);
      } else {
        uncategorizedServices.push(service);
      }
    });
    
    // Add uncategorized services if any exist
    if (uncategorizedServices.length > 0) {
      categorizedServices['Uncategorized'] = uncategorizedServices;
    }
    
    return categorizedServices;
  };

  const categorizedServices = services ? categorizeServices(services) : {};
  const categoryNames = Object.keys(categorizedServices);

  // Helper function to get category color
  const getCategoryColor = (categoryName: string) => {
    if (categoryName === 'Uncategorized') return '#6B7280';
    const category = categories?.find(cat => cat.name === categoryName);
    return category?.color || '#3B82F6';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <div className="flex space-x-3">
          <SyncServicesButton tenantId={tenantId} />
          <ManageCategoriesDialog />
          <NewServiceDialog />
        </div>
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
        categoryNames.length > 0 ? (
          categoryNames.map(categoryName => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center space-x-3 border-b pb-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(categoryName) }}
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {categoryName}
                </h2>
                <span className="text-sm text-gray-500">
                  ({categorizedServices[categoryName].length} service{categorizedServices[categoryName].length !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorizedServices[categoryName].map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex space-x-1">
                          <EditServiceDialog service={service} />
                          <DeleteServiceDialog service={service} />
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
                        
                        <Badge 
                          variant="outline" 
                          className="w-fit"
                          style={{ 
                            borderColor: getCategoryColor(categoryName),
                            color: getCategoryColor(categoryName)
                          }}
                        >
                          {categoryName}
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
        )
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
  );
};

export default Services;

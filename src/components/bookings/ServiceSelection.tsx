
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Service } from '@/types';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useTenant } from '@/contexts/TenantContext';

interface ServiceSelectionProps {
  selectedServiceIds: string[];
  onServiceToggle: (serviceId: string, checked: boolean) => void;
  services?: Service[];
}

export const ServiceSelection = ({ selectedServiceIds, onServiceToggle, services }: ServiceSelectionProps) => {
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  
  const { tenantId } = useTenant();
  const { data: categories } = useServiceCategories(tenantId || '');

  // Filter services based on search query and category
  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      service.category?.name.toLowerCase().includes(serviceSearchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryId === 'all' || 
      selectedCategoryId === 'uncategorized' && !service.categoryId ||
      service.categoryId === selectedCategoryId;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="space-y-2">
      <Label>Services</Label>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Select Services</CardTitle>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Filter by Category</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-3">
              {filteredServices.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                  {serviceSearchQuery || selectedCategoryId !== 'all' ? 'No services found matching your filters.' : 'No services available.'}
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={service.id}
                      checked={selectedServiceIds.includes(service.id)}
                      onCheckedChange={(checked) => onServiceToggle(service.id, checked as boolean)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={service.id} className="font-medium cursor-pointer text-sm leading-tight">
                        {service.name}
                      </Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {service.duration}min • ${service.price}
                      </div>
                      {service.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</div>
                      )}
                      {service.category && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: service.category.color }}
                          />
                          <span className="text-xs text-blue-600">{service.category.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

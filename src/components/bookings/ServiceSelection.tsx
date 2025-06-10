
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, DollarSign } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services by name or description..."
            value={serviceSearchQuery}
            onChange={(e) => setServiceSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Filter by Category</Label>
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="h-11">
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

      {/* Services List */}
      <div className="border rounded-lg">
        <ScrollArea className="h-64">
          <div className="p-4 space-y-3">
            {filteredServices.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {serviceSearchQuery || selectedCategoryId !== 'all' 
                    ? 'No services found matching your filters.' 
                    : 'No services available.'
                  }
                </p>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onServiceToggle(service.id, !isSelected)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={service.id}
                          checked={isSelected}
                          onCheckedChange={(checked) => onServiceToggle(service.id, checked as boolean)}
                          className="mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Label 
                                htmlFor={service.id} 
                                className="font-semibold cursor-pointer text-base leading-tight"
                              >
                                {service.name}
                              </Label>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {service.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{service.duration}min</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <DollarSign className="h-4 w-4" />
                                <span>${service.price}</span>
                              </div>
                            </div>
                            
                            {service.category && (
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: service.category.color }}
                                />
                                <span className="text-xs text-blue-600 font-medium">
                                  {service.category.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

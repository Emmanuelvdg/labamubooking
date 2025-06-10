
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Service } from '@/types';

interface ServiceSelectionProps {
  selectedServiceIds: string[];
  onServiceToggle: (serviceId: string, checked: boolean) => void;
  services?: Service[];
}

export const ServiceSelection = ({ selectedServiceIds, onServiceToggle, services }: ServiceSelectionProps) => {
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');

  // Filter services based on search query
  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.category?.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-2">
      <Label>Services</Label>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Select Services</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={serviceSearchQuery}
              onChange={(e) => setServiceSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-3">
              {filteredServices.length === 0 ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                  {serviceSearchQuery ? 'No services found matching your search.' : 'No services available.'}
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
                        <div className="text-xs text-blue-600 mt-1">{service.category.name}</div>
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

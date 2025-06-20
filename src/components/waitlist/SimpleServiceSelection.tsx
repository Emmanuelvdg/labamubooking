
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/types';

interface SimpleServiceSelectionProps {
  selectedServiceId: string;
  onServiceSelect: (serviceId: string) => void;
  services?: Service[];
}

export const SimpleServiceSelection = ({ selectedServiceId, onServiceSelect, services }: SimpleServiceSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="service">Service</Label>
      <Select value={selectedServiceId} onValueChange={onServiceSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select service" />
        </SelectTrigger>
        <SelectContent>
          {services?.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name} - Rp{service.price} ({service.duration}min)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types';

interface SimpleCustomerSelectionProps {
  selectedCustomerId: string;
  onCustomerSelect: (customerId: string) => void;
  customers?: Customer[];
}

export const SimpleCustomerSelection = ({ selectedCustomerId, onCustomerSelect, customers }: SimpleCustomerSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="customer">Customer</Label>
      <Select value={selectedCustomerId} onValueChange={onCustomerSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select customer" />
        </SelectTrigger>
        <SelectContent>
          {customers?.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types';

interface CustomerSelectionProps {
  value: string;
  onValueChange: (value: string) => void;
  customers?: Customer[];
}

export const CustomerSelection = ({ value, onValueChange, customers }: CustomerSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="customer">Customer</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="walk-in">Walk In (Anonymous)</SelectItem>
          <SelectItem value="create-new">Create New Client</SelectItem>
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

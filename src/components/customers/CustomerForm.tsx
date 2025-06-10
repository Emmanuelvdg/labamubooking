import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer } from '@/types';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { useTenant } from '@/contexts/TenantContext';

interface CustomerFormProps {
  customer?: Partial<Customer>;
  initialData?: Customer;
  onSubmit?: (customer: Omit<Customer, 'id'>) => void;
  onSuccess?: (customerId?: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CustomerForm = ({ 
  customer, 
  initialData, 
  onSubmit, 
  onSuccess, 
  onCancel, 
  isLoading: externalLoading 
}: CustomerFormProps) => {
  const { tenantId } = useTenant();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  
  // Use initialData if provided, otherwise use customer prop
  const customerData = initialData || customer;
  
  const [formData, setFormData] = useState({
    name: customerData?.name || '',
    email: customerData?.email || '',
    phone: customerData?.phone || '',
    birthDate: customerData?.birthDate || '',
  });

  const isUpdating = Boolean(customerData?.id);
  const internalLoading = createCustomer.isPending || updateCustomer.isPending;
  const loading = externalLoading || internalLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) return;

    const customerPayload = {
      ...formData,
      tenantId,
    };

    // If onSubmit is provided, use the parent's submit handler
    if (onSubmit) {
      onSubmit(customerPayload);
      return;
    }

    // Otherwise, handle the mutation internally
    try {
      if (isUpdating && customerData?.id) {
        await updateCustomer.mutateAsync({
          id: customerData.id,
          ...customerPayload,
        });
        onSuccess?.();
      } else {
        const result = await createCustomer.mutateAsync(customerPayload);
        onSuccess?.(result.id);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleChange('birthDate', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isUpdating ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

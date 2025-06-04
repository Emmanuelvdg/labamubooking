
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { useTenant } from '@/contexts/TenantContext';
import { Customer } from '@/types';

interface CustomerFormProps {
  onSuccess?: (customerId?: string) => void;
  initialData?: Customer;
}

export const CustomerForm = ({ onSuccess, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const { tenantId } = useTenant();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    if (!tenantId) {
      console.error('No tenant ID available');
      return;
    }

    try {
      if (isEditing && initialData) {
        const updatedCustomer = await updateCustomer.mutateAsync({
          ...initialData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
        });
        onSuccess?.(updatedCustomer.id);
      } else {
        const newCustomer = await createCustomer.mutateAsync({
          tenantId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
        });
        onSuccess?.(newCustomer.id);
        setFormData({ name: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isPending || !tenantId}>
          {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Customer' : 'Create Customer')}
        </Button>
      </div>
    </form>
  );
};


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCustomer } from '@/hooks/useCustomers';

interface CustomerFormProps {
  onSuccess?: (customerId?: string) => void;
}

export const CustomerForm = ({ onSuccess }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const createCustomer = useCreateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    // Using a proper UUID format for demo purposes
    const tenantId = '00000000-0000-0000-0000-000000000001';

    try {
      const newCustomer = await createCustomer.mutateAsync({
        tenantId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
      });

      onSuccess?.(newCustomer.id);
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

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
        <Button type="submit" disabled={createCustomer.isPending}>
          {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

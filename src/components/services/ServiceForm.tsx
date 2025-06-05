
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateService } from '@/hooks/useServices';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useTenant } from '@/contexts/TenantContext';

interface ServiceFormProps {
  onSuccess?: () => void;
}

export const ServiceForm = ({ onSuccess }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    categoryId: 'none'
  });

  const { tenantId } = useTenant();
  const createService = useCreateService();
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories(tenantId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration || !formData.price || !tenantId) {
      return;
    }

    await createService.mutateAsync({
      tenantId,
      name: formData.name,
      description: formData.description,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      categoryId: formData.categoryId === 'none' ? undefined : formData.categoryId,
    });

    onSuccess?.();
    setFormData({ name: '', description: '', duration: '', price: '', categoryId: 'none' });
  };

  if (!tenantId) {
    return (
      <div className="text-center text-gray-500">
        <p>No tenant access found. Please contact support.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the service..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category (optional)" />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading ? (
              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
            ) : (
              <>
                <SelectItem value="none">No category</SelectItem>
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
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            step="15"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={createService.isPending}>
          {createService.isPending ? 'Creating...' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
};


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateServiceCategory } from '@/hooks/useServiceCategories';

interface CategoryFormProps {
  onSuccess?: () => void;
}

export const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const tenantId = '00000000-0000-0000-0000-000000000001';
  const createCategory = useCreateServiceCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      return;
    }

    await createCategory.mutateAsync({
      tenantId,
      name: formData.name,
      description: formData.description,
      color: formData.color,
    });

    onSuccess?.();
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
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
          placeholder="Describe the category..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            placeholder="#3B82F6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={createCategory.isPending}>
          {createCategory.isPending ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

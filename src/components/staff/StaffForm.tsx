
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { Staff } from '@/types';

interface StaffFormProps {
  onSuccess?: () => void;
  initialData?: Staff;
}

export const StaffForm = ({ onSuccess, initialData }: StaffFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: ''
  });

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const { tenantId } = useTenant();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        skills: initialData.skills.join(', ')
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      return;
    }

    if (!tenantId) {
      console.error('No tenant ID available');
      return;
    }

    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    try {
      if (isEditing && initialData) {
        await updateStaff.mutateAsync({
          ...initialData,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          skills: skillsArray,
        });
      } else {
        await createStaff.mutateAsync({
          tenantId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          skills: skillsArray,
          isActive: true,
        });
      }

      onSuccess?.();
      if (!isEditing) {
        setFormData({ name: '', email: '', role: '', skills: '' });
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const isPending = createStaff.isPending || updateStaff.isPending;

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
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Senior Stylist">Senior Stylist</SelectItem>
            <SelectItem value="Junior Stylist">Junior Stylist</SelectItem>
            <SelectItem value="Color Specialist">Color Specialist</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Receptionist">Receptionist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          type="text"
          placeholder="e.g. Haircut, Color, Style"
          value={formData.skills}
          onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isPending || !tenantId}>
          {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Staff Member' : 'Create Staff Member')}
        </Button>
      </div>
    </form>
  );
};

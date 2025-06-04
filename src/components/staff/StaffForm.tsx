
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateStaff } from '@/hooks/useStaff';

interface StaffFormProps {
  onSuccess?: () => void;
}

export const StaffForm = ({ onSuccess }: StaffFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: ''
  });

  const createStaff = useCreateStaff();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      return;
    }

    // Using the same UUID format as in other pages
    const tenantId = '00000000-0000-0000-0000-000000000001';

    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    await createStaff.mutateAsync({
      tenantId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      skills: skillsArray,
      isActive: true,
    });

    onSuccess?.();
    setFormData({ name: '', email: '', role: '', skills: '' });
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
        <Button type="submit" disabled={createStaff.isPending}>
          {createStaff.isPending ? 'Creating...' : 'Create Staff Member'}
        </Button>
      </div>
    </form>
  );
};

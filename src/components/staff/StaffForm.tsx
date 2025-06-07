
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff';
import { useStaffRoles } from '@/hooks/useStaffRoles';
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
    roleId: '',
    skills: ''
  });

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const { tenantId } = useTenant();
  const { data: roles } = useStaffRoles(tenantId || '');
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        roleId: initialData.roleId || '',
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
          roleId: formData.roleId || undefined,
          skills: skillsArray,
        });
      } else {
        await createStaff.mutateAsync({
          tenantId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          roleId: formData.roleId || undefined,
          skills: skillsArray,
          isActive: true,
        });
      }

      onSuccess?.();
      if (!isEditing) {
        setFormData({ name: '', email: '', role: '', roleId: '', skills: '' });
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles?.find(role => role.id === roleId);
    setFormData(prev => ({ 
      ...prev, 
      roleId,
      role: selectedRole?.name || ''
    }));
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
        {roles && roles.length > 0 ? (
          <Select value={formData.roleId} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-gray-500">
            No roles available. Create roles first using "Manage Roles".
          </div>
        )}
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
        <Button type="submit" disabled={isPending || !tenantId || (!formData.roleId && roles && roles.length > 0)}>
          {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Staff Member' : 'Create Staff Member')}
        </Button>
      </div>
    </form>
  );
};

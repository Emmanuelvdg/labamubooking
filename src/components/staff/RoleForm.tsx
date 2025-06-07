
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateStaffRole, useUpdateStaffRole, StaffRole } from '@/hooks/useStaffRoles';

interface RoleFormProps {
  tenantId: string;
  initialData?: StaffRole;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'view_bookings', label: 'View Bookings' },
  { id: 'create_bookings', label: 'Create Bookings' },
  { id: 'edit_bookings', label: 'Edit Bookings' },
  { id: 'delete_bookings', label: 'Delete Bookings' },
  { id: 'view_customers', label: 'View Customers' },
  { id: 'create_customers', label: 'Create Customers' },
  { id: 'edit_customers', label: 'Edit Customers' },
  { id: 'view_services', label: 'View Services' },
  { id: 'manage_services', label: 'Manage Services' },
  { id: 'view_staff', label: 'View Staff' },
  { id: 'manage_staff', label: 'Manage Staff' },
  { id: 'view_reports', label: 'View Reports' },
  { id: 'manage_settings', label: 'Manage Settings' },
];

export const RoleForm = ({ tenantId, initialData, onSuccess, onCancel }: RoleFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const createRole = useCreateStaffRole();
  const updateRole = useUpdateStaffRole();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        permissions: initialData.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      if (isEditing && initialData) {
        await updateRole.mutateAsync({
          ...initialData,
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
        });
      } else {
        await createRole.mutateAsync({
          tenantId,
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          isActive: true,
        });
      }

      onSuccess?.();
      if (!isEditing) {
        setFormData({ name: '', description: '', permissions: [] });
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const isPending = createRole.isPending || updateRole.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Senior Stylist, Manager"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this role..."
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label>Permissions</Label>
        <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onCheckedChange={(checked) => 
                  handlePermissionChange(permission.id, !!checked)
                }
              />
              <Label 
                htmlFor={permission.id}
                className="text-sm font-normal cursor-pointer"
              >
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Role' : 'Create Role')}
        </Button>
      </div>
    </form>
  );
};

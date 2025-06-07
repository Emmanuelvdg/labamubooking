
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { RoleForm } from './RoleForm';
import { RolesList } from './RolesList';
import { useTenant } from '@/contexts/TenantContext';

export const ManageRolesDialog = () => {
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const { tenantId } = useTenant();

  const handleEditRole = (role) => {
    setEditingRole(role);
  };

  const handleCloseEdit = () => {
    setEditingRole(null);
  };

  if (!tenantId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Manage Roles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Staff Roles</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            <RoleForm 
              tenantId={tenantId}
              initialData={editingRole}
              onSuccess={handleCloseEdit}
              onCancel={editingRole ? handleCloseEdit : undefined}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Existing Roles</h3>
            <RolesList 
              tenantId={tenantId}
              onEditRole={handleEditRole}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

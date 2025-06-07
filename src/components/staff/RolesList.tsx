
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useStaffRoles, useDeleteStaffRole, StaffRole } from '@/hooks/useStaffRoles';

interface RolesListProps {
  tenantId: string;
  onEditRole: (role: StaffRole) => void;
}

export const RolesList = ({ tenantId, onEditRole }: RolesListProps) => {
  const { data: roles, isLoading } = useStaffRoles(tenantId);
  const deleteRole = useDeleteStaffRole();

  const handleDelete = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role? Staff members with this role will need to be reassigned.')) {
      try {
        await deleteRole.mutateAsync(roleId);
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No roles created yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {roles.map((role) => (
        <Card key={role.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{role.name}</CardTitle>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditRole(role)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {role.description && (
              <p className="text-sm text-gray-600 mb-2">{role.description}</p>
            )}
            <div className="flex flex-wrap gap-1">
              {role.permissions.length > 0 ? (
                role.permissions.slice(0, 3).map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission.replace(/_/g, ' ')}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-500">No permissions set</span>
              )}
              {role.permissions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{role.permissions.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

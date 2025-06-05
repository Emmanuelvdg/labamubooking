
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Staff } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface StaffAccountFormProps {
  staff: Staff;
  onSuccess?: () => void;
}

interface Permission {
  id: string;
  resource: string;
  permission: string;
  description: string;
}

interface StaffAccount {
  id: string;
  email: string;
  is_active: boolean;
}

export const StaffAccountForm = ({ staff, onSuccess }: StaffAccountFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { tenantId } = useTenant();

  // Fetch existing staff account
  const { data: existingAccount } = useQuery({
    queryKey: ['staff-account', staff.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .eq('staff_id', staff.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data as StaffAccount | null;
    }
  });

  // Fetch all available permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('resource', { ascending: true })
        .order('permission', { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    }
  });

  // Fetch current staff permissions
  const { data: currentPermissions = [] } = useQuery({
    queryKey: ['staff-permissions', staff.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_permissions')
        .select('permission_id')
        .eq('staff_id', staff.id);
      
      if (error) throw error;
      return data.map(p => p.permission_id);
    },
    enabled: !!existingAccount
  });

  // Initialize form when data loads
  useState(() => {
    if (existingAccount) {
      setEmail(existingAccount.email);
      setIsActive(existingAccount.is_active);
    }
    setSelectedPermissions(currentPermissions);
  }, [existingAccount, currentPermissions]);

  const handleCreateAccount = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create staff account
      const { data: account, error: accountError } = await supabase
        .from('staff_accounts')
        .insert({
          staff_id: staff.id,
          email,
          password_hash: password, // In production, this should be hashed on the backend
          is_active: isActive
        })
        .select()
        .single();

      if (accountError) throw accountError;

      // Add permissions
      if (selectedPermissions.length > 0) {
        const permissionInserts = selectedPermissions.map(permissionId => ({
          staff_id: staff.id,
          permission_id: permissionId
        }));

        const { error: permError } = await supabase
          .from('staff_permissions')
          .insert(permissionInserts);

        if (permError) throw permError;
      }

      // Log the action
      if (tenantId) {
        await supabase.rpc('log_action', {
          tenant_uuid: tenantId,
          staff_uuid: staff.id,
          action_name: 'Staff account created',
          resource_type_name: 'staff',
          resource_uuid: staff.id,
          action_details: { email, permissions_count: selectedPermissions.length }
        });
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create staff account');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePermissions = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Remove existing permissions
      await supabase
        .from('staff_permissions')
        .delete()
        .eq('staff_id', staff.id);

      // Add new permissions
      if (selectedPermissions.length > 0) {
        const permissionInserts = selectedPermissions.map(permissionId => ({
          staff_id: staff.id,
          permission_id: permissionId
        }));

        const { error: permError } = await supabase
          .from('staff_permissions')
          .insert(permissionInserts);

        if (permError) throw permError;
      }

      // Log the action
      if (tenantId) {
        await supabase.rpc('log_action', {
          tenant_uuid: tenantId,
          staff_uuid: staff.id,
          action_name: 'Staff permissions updated',
          resource_type_name: 'staff',
          resource_uuid: staff.id,
          action_details: { permissions_count: selectedPermissions.length }
        });
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to update permissions');
    } finally {
      setIsCreating(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Account Management for {staff.name}</h3>
        {existingAccount && (
          <Badge variant={existingAccount.is_active ? "default" : "secondary"}>
            {existingAccount.is_active ? "Active" : "Inactive"}
          </Badge>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!existingAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Staff Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter initial password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active">Account Active</Label>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-gray-600">{existingAccount.email}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
            <div key={resource} className="space-y-2">
              <h4 className="font-medium capitalize">{resource}</h4>
              <div className="space-y-2 pl-4">
                {resourcePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={permission.id} className="text-sm">
                      <span className="font-medium">{permission.permission}</span>
                      {permission.description && (
                        <span className="text-gray-500 ml-1">- {permission.description}</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={existingAccount ? handleUpdatePermissions : handleCreateAccount}
          disabled={isCreating || (!existingAccount && (!email || !password))}
        >
          {isCreating 
            ? 'Processing...' 
            : existingAccount 
              ? 'Update Permissions' 
              : 'Create Account'
          }
        </Button>
      </div>
    </div>
  );
};

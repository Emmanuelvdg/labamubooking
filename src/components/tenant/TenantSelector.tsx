
import { useTenant } from '@/contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';
import NewBusinessDialog from './NewBusinessDialog';

export const TenantSelector = () => {
  const { tenantId, availableTenants, switchTenant, currentTenantRole, isLoading } = useTenant();

  if (isLoading) {
    return null;
  }

  const currentTenant = availableTenants.find(t => t.tenant_id === tenantId);

  return (
    <div className="flex items-center space-x-3">
      <Building2 className="h-4 w-4 text-gray-500" />
      
      {availableTenants.length > 1 && (
        <Select value={tenantId || ''} onValueChange={switchTenant}>
          <SelectTrigger className="w-auto min-w-[200px]">
            <SelectValue placeholder="Select business">
              {currentTenant && (
                <div className="flex items-center space-x-2">
                  <span>{currentTenant.tenant.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentTenantRole}
                  </Badge>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableTenants.map((userTenant) => (
              <SelectItem key={userTenant.tenant_id} value={userTenant.tenant_id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{userTenant.tenant.name}</div>
                    <div className="text-sm text-gray-500">{userTenant.tenant.business_type}</div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {userTenant.role}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {availableTenants.length === 1 && currentTenant && (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{currentTenant.tenant.name}</span>
          <Badge variant="secondary" className="text-xs">
            {currentTenantRole}
          </Badge>
        </div>
      )}
      
      <NewBusinessDialog />
    </div>
  );
};


import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useTenantContext } from '@/hooks/useTenantContext';
import { Badge } from '@/components/ui/badge';

export const TenantSecurityIndicator = () => {
  const { tenantId, availableTenants } = useTenant();
  const { isContextSet, error } = useTenantContext();

  if (!tenantId) {
    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        <AlertTriangle className="h-3 w-3" />
        <span>No Tenant Selected</span>
      </Badge>
    );
  }

  const currentTenant = availableTenants.find(t => t.tenant_id === tenantId);

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        <AlertTriangle className="h-3 w-3" />
        <span>Context Error</span>
      </Badge>
    );
  }

  if (!isContextSet) {
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Shield className="h-3 w-3" />
        <span>Context Loading</span>
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="flex items-center space-x-1 bg-green-600">
      <CheckCircle className="h-3 w-3" />
      <span>Secure: {currentTenant?.tenant.name || 'Unknown'}</span>
    </Badge>
  );
};

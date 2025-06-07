
import { useState, useCallback } from 'react';
import { UserTenant } from '@/types/tenantContext';

export const useTenantState = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [currentTenantRole, setCurrentTenantRole] = useState<string | null>(null);

  const switchTenant = useCallback((newTenantId: string, availableTenants: UserTenant[]) => {
    console.log('[TENANT] Switching to tenant:', newTenantId);
    setTenantId(newTenantId);
    
    const newTenant = availableTenants.find(ut => ut.tenant_id === newTenantId);
    setCurrentTenantRole(newTenant?.role || null);
  }, []);

  const selectDefaultTenant = useCallback((userTenants: UserTenant[]) => {
    if (userTenants && userTenants.length > 0) {
      // Sort tenants by role priority and creation date
      const sortedTenants = [...userTenants].sort((a, b) => {
        const roleOrder = { 'owner': 1, 'admin': 2, 'user': 3 };
        const roleA = roleOrder[a.role as keyof typeof roleOrder] || 4;
        const roleB = roleOrder[b.role as keyof typeof roleOrder] || 4;
        
        if (roleA !== roleB) {
          return roleA - roleB;
        }
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      const firstTenant = sortedTenants[0];
      setTenantId(firstTenant.tenant_id);
      setCurrentTenantRole(firstTenant.role);
      console.log('[TENANT] Default tenant selected:', firstTenant.tenant_id, 'Role:', firstTenant.role);
    } else {
      console.log('[TENANT] No tenants found - clearing state');
      setTenantId(null);
      setCurrentTenantRole(null);
    }
  }, []);

  return {
    tenantId,
    currentTenantRole,
    switchTenant,
    selectDefaultTenant
  };
};

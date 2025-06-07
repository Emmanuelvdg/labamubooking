
import { useState, useCallback } from 'react';
import { UserTenant } from '@/types/tenantContext';

export const useTenantSelection = (availableTenants: UserTenant[]) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [currentTenantRole, setCurrentTenantRole] = useState<string | null>(null);

  const switchTenant = useCallback((newTenantId: string) => {
    console.log('[TENANT] Switching to tenant:', newTenantId);
    setTenantId(newTenantId);
    
    const newTenant = availableTenants.find(ut => ut.tenant_id === newTenantId);
    setCurrentTenantRole(newTenant?.role || null);
  }, [availableTenants]);

  const selectDefaultTenant = useCallback((userTenants: UserTenant[], currentTenantId: string | null) => {
    if (userTenants && userTenants.length > 0) {
      // Enhanced tenant selection logic
      const sortedTenants = [...userTenants].sort((a, b) => {
        const roleOrder = { 'owner': 1, 'admin': 2, 'user': 3 };
        const roleA = roleOrder[a.role as keyof typeof roleOrder] || 4;
        const roleB = roleOrder[b.role as keyof typeof roleOrder] || 4;
        
        if (roleA !== roleB) {
          return roleA - roleB;
        }
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      // Check if current tenantId is still valid
      const currentTenantStillValid = userTenants.find(t => t.tenant_id === currentTenantId);
      
      if (currentTenantStillValid) {
        console.log('[TENANT] Current tenant still valid, keeping it');
        setCurrentTenantRole(currentTenantStillValid.role);
      } else {
        const firstTenant = sortedTenants[0];
        setTenantId(firstTenant.tenant_id);
        setCurrentTenantRole(firstTenant.role);
        console.log('[TENANT] Current tenant ID set to:', firstTenant.tenant_id, 'Role:', firstTenant.role);
      }
    } else {
      console.log('[TENANT] No tenants found for user - clean slate for new business creation');
      setTenantId(null);
      setCurrentTenantRole(null);
    }
  }, []);

  return {
    tenantId,
    setTenantId,
    currentTenantRole,
    setCurrentTenantRole,
    switchTenant,
    selectDefaultTenant
  };
};

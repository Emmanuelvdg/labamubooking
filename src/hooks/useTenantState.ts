
import { useState, useCallback, useEffect } from 'react';
import { UserTenant } from '@/types/tenantContext';
import { useTenantContext } from '@/hooks/useTenantContext';

export const useTenantState = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [currentTenantRole, setCurrentTenantRole] = useState<string | null>(null);
  
  const { 
    setTenantContext, 
    clearTenantContext, 
    getCurrentTenantId,
    isContextSet 
  } = useTenantContext();

  const switchTenant = useCallback(async (newTenantId: string, availableTenants: UserTenant[]) => {
    console.log('[TENANT STATE] Switching to tenant:', newTenantId);
    
    const success = await setTenantContext(newTenantId);
    
    if (success) {
      setTenantId(newTenantId);
      
      // Update role
      const tenantData = availableTenants.find(t => t.tenant_id === newTenantId);
      setCurrentTenantRole(tenantData?.role || null);
      
      console.log('[TENANT STATE] Switched to tenant successfully');
    } else {
      console.error('[TENANT STATE] Failed to switch tenant');
    }
  }, [setTenantContext]);

  const selectDefaultTenant = useCallback(async (availableTenants: UserTenant[]) => {
    if (availableTenants.length === 0) {
      console.log('[TENANT STATE] No tenants available');
      return;
    }

    // Try to get current tenant from database first
    const currentTenant = await getCurrentTenantId();
    
    if (currentTenant) {
      const tenantData = availableTenants.find(t => t.tenant_id === currentTenant);
      if (tenantData) {
        console.log('[TENANT STATE] Using existing tenant context:', currentTenant);
        setTenantId(currentTenant);
        setCurrentTenantRole(tenantData.role);
        return;
      }
    }

    // Select default tenant (prioritize owner, then admin, then first available)
    const defaultTenant = availableTenants.find(t => t.role === 'owner') || 
                         availableTenants.find(t => t.role === 'admin') || 
                         availableTenants[0];

    console.log('[TENANT STATE] Selecting default tenant:', defaultTenant.tenant_id);
    await switchTenant(defaultTenant.tenant_id, availableTenants);
  }, [getCurrentTenantId, switchTenant]);

  // Clear tenant state when context is cleared
  useEffect(() => {
    if (!isContextSet) {
      setTenantId(null);
      setCurrentTenantRole(null);
    }
  }, [isContextSet]);

  const cleanup = useCallback(() => {
    console.log('[TENANT STATE] Cleaning up tenant state');
    clearTenantContext();
    setTenantId(null);
    setCurrentTenantRole(null);
  }, [clearTenantContext]);

  return {
    tenantId,
    currentTenantRole,
    switchTenant,
    selectDefaultTenant,
    cleanup
  };
};

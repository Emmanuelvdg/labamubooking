
import { useEffect, ReactNode } from 'react';
import { TenantContext } from '@/contexts/TenantContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useTenantData } from '@/hooks/useTenantData';
import { useTenantState } from '@/hooks/useTenantState';
import { useTenantContext } from '@/hooks/useTenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { user, loading: authLoading, session, error: authError } = useAuthState();
  
  const {
    availableTenants,
    isLoading: tenantLoading,
    error: tenantError,
    fetchTenants,
    cleanup,
    refetch
  } = useTenantData();

  const {
    tenantId,
    currentTenantRole,
    switchTenant,
    selectDefaultTenant,
    cleanup: cleanupTenantState
  } = useTenantState();

  const { refreshTenantContext } = useTenantContext();

  // Fetch tenants when user is available
  useEffect(() => {
    if (!authLoading && user && session && !authError) {
      console.log('[TENANT PROVIDER] User authenticated, fetching tenants');
      fetchTenants(user.id);
    } else if (!authLoading && (!user || authError)) {
      console.log('[TENANT PROVIDER] User not authenticated, clearing tenant data');
      cleanup();
      cleanupTenantState();
    }

    return () => {
      cleanup();
    };
  }, [user, authLoading, session, authError, fetchTenants, cleanup, cleanupTenantState]);

  // Select default tenant when tenants are loaded
  useEffect(() => {
    if (availableTenants.length > 0 && !tenantId) {
      selectDefaultTenant(availableTenants);
    }
  }, [availableTenants, tenantId, selectDefaultTenant]);

  // Refresh tenant context periodically
  useEffect(() => {
    if (tenantId && user) {
      const refreshInterval = setInterval(() => {
        refreshTenantContext();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [tenantId, user, refreshTenantContext]);

  const handleSwitchTenant = (newTenantId: string) => {
    switchTenant(newTenantId, availableTenants);
  };

  const refetchTenant = async () => {
    if (user) {
      console.log('[TENANT PROVIDER] Manual refetch triggered');
      refetch();
      await fetchTenants(user.id);
    }
  };

  return (
    <TenantContext.Provider value={{ 
      tenantId, 
      isLoading: tenantLoading, 
      error: tenantError, 
      refetchTenant, 
      availableTenants,
      switchTenant: handleSwitchTenant,
      currentTenantRole
    }}>
      {children}
    </TenantContext.Provider>
  );
};

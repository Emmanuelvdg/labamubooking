
import { useEffect, ReactNode } from 'react';
import { TenantContext } from '@/contexts/TenantContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useTenantData } from '@/hooks/useTenantData';
import { useTenantState } from '@/hooks/useTenantState';

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
    selectDefaultTenant
  } = useTenantState();

  // Fetch tenants when user is available
  useEffect(() => {
    if (!authLoading && user && session && !authError) {
      console.log('[TENANT] User authenticated, fetching tenants');
      fetchTenants(user.id);
    } else if (!authLoading && (!user || authError)) {
      console.log('[TENANT] User not authenticated, clearing tenant data');
      cleanup();
    }

    return cleanup;
  }, [user, authLoading, session, authError, fetchTenants, cleanup]);

  // Select default tenant when tenants are loaded
  useEffect(() => {
    if (availableTenants.length > 0 && !tenantId) {
      selectDefaultTenant(availableTenants);
    }
  }, [availableTenants, tenantId, selectDefaultTenant]);

  const handleSwitchTenant = (newTenantId: string) => {
    switchTenant(newTenantId, availableTenants);
  };

  const refetchTenant = async () => {
    if (user) {
      console.log('[TENANT] Manual refetch triggered');
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

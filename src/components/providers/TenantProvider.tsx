
import { useEffect, ReactNode } from 'react';
import { TenantContext } from '@/contexts/TenantContext';
import { useTenantFetching } from '@/hooks/useTenantFetching';
import { useTenantSelection } from '@/hooks/useTenantSelection';
import { useAuth } from '@/hooks/useAuth';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { user, loading: authLoading, session, error: authError } = useAuth();
  
  const {
    availableTenants,
    isLoading,
    error,
    fetchUserTenants,
    cleanup
  } = useTenantFetching();

  const {
    tenantId,
    currentTenantRole,
    switchTenant,
    selectDefaultTenant
  } = useTenantSelection(availableTenants);

  const refetchTenant = async () => {
    console.log('[TENANT] Manual tenant refetch triggered - fetching fresh data');
    cleanup();
    await fetchUserTenants();
  };

  // Apply tenant selection logic when tenants are fetched
  useEffect(() => {
    selectDefaultTenant(availableTenants, tenantId);
  }, [availableTenants, selectDefaultTenant, tenantId]);

  useEffect(() => {
    console.log('[TENANT] Context effect triggered - user:', !!user, 'authLoading:', authLoading, 'session:', !!session, 'authError:', !!authError);
    
    // Reset loading state when auth changes
    if (!authLoading) {
      fetchUserTenants();
    }

    // Cleanup function
    return cleanup;
  }, [fetchUserTenants, authLoading, cleanup]);

  // Enhanced error recovery when auth state recovers - but with debouncing
  useEffect(() => {
    if (!authError && !authLoading && user && session && error) {
      console.log('[TENANT] Auth recovered, attempting to refetch tenants after delay');
      
      // Add a delay to prevent immediate concurrent requests
      const recoveryTimeout = setTimeout(() => {
        fetchUserTenants();
      }, 1000);

      return () => clearTimeout(recoveryTimeout);
    }
  }, [authError, authLoading, user, session, error, fetchUserTenants]);

  return (
    <TenantContext.Provider value={{ 
      tenantId, 
      isLoading, 
      error, 
      refetchTenant, 
      availableTenants,
      switchTenant,
      currentTenantRole
    }}>
      {children}
    </TenantContext.Provider>
  );
};

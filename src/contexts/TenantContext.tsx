
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserTenant {
  id: string;
  tenant_id: string;
  role: string;
  created_at: string;
  tenant: {
    id: string;
    name: string;
    business_type: string;
  };
}

interface TenantContextType {
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  refetchTenant: () => Promise<void>;
  availableTenants: UserTenant[];
  switchTenant: (tenantId: string) => void;
  currentTenantRole: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTenants, setAvailableTenants] = useState<UserTenant[]>([]);
  const [currentTenantRole, setCurrentTenantRole] = useState<string | null>(null);
  const { user, loading: authLoading, session, error: authError } = useAuth();

  // Use refs to track ongoing requests and prevent duplicates
  const currentRequestRef = useRef<AbortController | null>(null);
  const isRequestInProgressRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUserTenants = useCallback(async (retryCount = 0) => {
    const maxRetries = 3; // Reduced from 5 to prevent resource exhaustion
    const baseDelay = 2000; // Increased base delay
    const retryDelay = baseDelay * Math.pow(2, retryCount);

    console.log(`[TENANT] Fetch attempt ${retryCount + 1}/${maxRetries + 1}`);

    // Prevent multiple concurrent requests
    if (isRequestInProgressRef.current) {
      console.log('[TENANT] Request already in progress, skipping');
      return;
    }

    if (authLoading) {
      console.log('[TENANT] Auth still loading, skipping tenant fetch');
      return;
    }
    
    // If there's an auth error, don't try to fetch tenants
    if (authError) {
      console.log('[TENANT] Auth error detected, clearing tenant state');
      setTenantId(null);
      setAvailableTenants([]);
      setCurrentTenantRole(null);
      setIsLoading(false);
      setError('Authentication required');
      return;
    }
    
    if (!user || !session) {
      console.log('[TENANT] No user or session found, clearing tenant state');
      setTenantId(null);
      setAvailableTenants([]);
      setCurrentTenantRole(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Cancel any existing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    currentRequestRef.current = abortController;
    isRequestInProgressRef.current = true;

    try {
      console.log(`[TENANT] Fetching tenants for user: ${user.id} (attempt ${retryCount + 1})`);
      
      // Use the AbortController signal for the request
      const { data: userTenants, error: tenantsError } = await supabase
        .from('user_tenants')
        .select(`
          id,
          tenant_id,
          role,
          created_at,
          tenant:tenants (
            id,
            name,
            business_type
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .abortSignal(abortController.signal);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('[TENANT] Request was aborted');
        return;
      }

      if (tenantsError) {
        console.error('[TENANT] Error fetching user tenants:', tenantsError);
        
        // Only retry if we haven't exceeded max retries and it's not an auth error
        if (retryCount < maxRetries && !tenantsError.message.includes('JWT') && !tenantsError.code?.includes('42501')) {
          console.log(`[TENANT] Will retry in ${retryDelay}ms...`);
          
          // Clear the retry timeout if it exists
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          
          retryTimeoutRef.current = setTimeout(() => {
            isRequestInProgressRef.current = false;
            fetchUserTenants(retryCount + 1);
          }, retryDelay);
          return;
        }
        
        console.error('[TENANT] Max retries exceeded or auth error, setting error state');
        setError(`Failed to load tenant information: ${tenantsError.message}`);
        setIsLoading(false);
        return;
      }

      console.log('[TENANT] Available tenants:', userTenants);
      setAvailableTenants(userTenants || []);
      
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
        const currentTenantStillValid = userTenants.find(t => t.tenant_id === tenantId);
        
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
      
      setError(null);
      console.log('[TENANT] Fetch completed successfully');
    } catch (err: any) {
      // Don't log errors for aborted requests
      if (err.name === 'AbortError') {
        console.log('[TENANT] Request was aborted');
        return;
      }
      
      console.error('[TENANT] Unexpected error fetching tenant:', err);
      
      // Only retry for non-abort errors
      if (retryCount < maxRetries) {
        console.log(`[TENANT] Unexpected error, retrying in ${retryDelay}ms...`);
        
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        retryTimeoutRef.current = setTimeout(() => {
          isRequestInProgressRef.current = false;
          fetchUserTenants(retryCount + 1);
        }, retryDelay);
        return;
      }
      
      console.error('[TENANT] Max retries exceeded for unexpected error');
      setError('Failed to load tenant information due to unexpected error');
      setTenantId(null);
      setCurrentTenantRole(null);
    } finally {
      isRequestInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [user, authLoading, session, authError, tenantId]);

  const switchTenant = (newTenantId: string) => {
    console.log('[TENANT] Switching to tenant:', newTenantId);
    setTenantId(newTenantId);
    
    const newTenant = availableTenants.find(ut => ut.tenant_id === newTenantId);
    setCurrentTenantRole(newTenant?.role || null);
  };

  const refetchTenant = async () => {
    console.log('[TENANT] Manual tenant refetch triggered - fetching fresh data');
    
    // Cancel any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    
    // Clear any pending retries
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    isRequestInProgressRef.current = false;
    setIsLoading(true);
    setError(null);
    await fetchUserTenants();
  };

  useEffect(() => {
    console.log('[TENANT] Context effect triggered - user:', !!user, 'authLoading:', authLoading, 'session:', !!session, 'authError:', !!authError);
    
    // Reset loading state when auth changes
    if (!authLoading) {
      fetchUserTenants();
    }

    // Cleanup function
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      isRequestInProgressRef.current = false;
    };
  }, [fetchUserTenants]);

  // Enhanced error recovery when auth state recovers - but with debouncing
  useEffect(() => {
    if (!authError && !authLoading && user && session && error) {
      console.log('[TENANT] Auth recovered, attempting to refetch tenants after delay');
      
      // Add a delay to prevent immediate concurrent requests
      const recoveryTimeout = setTimeout(() => {
        if (!isRequestInProgressRef.current) {
          setError(null);
          setIsLoading(true);
          fetchUserTenants();
        }
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

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

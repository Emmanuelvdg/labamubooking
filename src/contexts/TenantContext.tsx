
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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

  const fetchUserTenants = useCallback(async (retryCount = 0) => {
    const maxRetries = 5; // Increased from 3
    const baseDelay = 1000;
    const retryDelay = baseDelay * Math.pow(2, retryCount); // Exponential backoff

    console.log(`[TENANT] Fetch attempt ${retryCount + 1}/${maxRetries + 1}`);

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

    try {
      console.log(`[TENANT] Fetching tenants for user: ${user.id} (attempt ${retryCount + 1})`);
      
      // Enhanced query with better error handling
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
        .order('created_at', { ascending: false });

      if (tenantsError) {
        console.error('[TENANT] Error fetching user tenants:', tenantsError);
        
        // Enhanced retry logic with specific error handling
        if (retryCount < maxRetries) {
          // Handle specific error types
          if (tenantsError.code === 'PGRST116' || tenantsError.code === '42501') {
            console.log(`[TENANT] Permission error, retrying in ${retryDelay}ms...`);
          } else if (tenantsError.code === 'PGRST301' || tenantsError.message.includes('JWT')) {
            console.log(`[TENANT] JWT/Auth error, retrying in ${retryDelay}ms...`);
          } else {
            console.log(`[TENANT] Network/DB error, retrying in ${retryDelay}ms...`);
          }
          
          setTimeout(() => {
            fetchUserTenants(retryCount + 1);
          }, retryDelay);
          return;
        }
        
        console.error('[TENANT] Max retries exceeded, setting error state');
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
    } catch (err) {
      console.error('[TENANT] Unexpected error fetching tenant:', err);
      
      // Enhanced retry logic for unexpected errors
      if (retryCount < maxRetries) {
        console.log(`[TENANT] Unexpected error, retrying in ${retryDelay}ms...`);
        setTimeout(() => {
          fetchUserTenants(retryCount + 1);
        }, retryDelay);
        return;
      }
      
      console.error('[TENANT] Max retries exceeded for unexpected error');
      setError('Failed to load tenant information due to unexpected error');
      setTenantId(null);
      setCurrentTenantRole(null);
    } finally {
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
  }, [fetchUserTenants]);

  // Enhanced error recovery when auth state recovers
  useEffect(() => {
    if (!authError && !authLoading && user && session && error) {
      console.log('[TENANT] Auth recovered, attempting to refetch tenants');
      setError(null);
      setIsLoading(true);
      fetchUserTenants();
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

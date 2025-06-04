
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TenantContextType {
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  refetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchUserTenant = async () => {
    if (authLoading) return;
    
    if (!user) {
      setTenantId(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      console.log('Fetching tenant for user:', user.id);
      
      // Call the database function to get user's tenant ID
      const { data, error } = await supabase.rpc('get_user_tenant_id');
      
      if (error) {
        console.error('Error fetching user tenant:', error);
        setError('Failed to load tenant information');
        setTenantId(null);
      } else {
        console.log('User tenant ID:', data);
        setTenantId(data);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching tenant:', err);
      setError('Failed to load tenant information');
      setTenantId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchTenant = async () => {
    setIsLoading(true);
    setError(null);
    await fetchUserTenant();
  };

  useEffect(() => {
    fetchUserTenant();
  }, [user, authLoading]);

  // Auto-refetch when user changes (helpful after linking user to tenant)
  useEffect(() => {
    if (user && !tenantId && !isLoading && !error) {
      console.log('User exists but no tenant found, retrying...');
      setTimeout(() => {
        refetchTenant();
      }, 1000);
    }
  }, [user, tenantId, isLoading, error]);

  return (
    <TenantContext.Provider value={{ tenantId, isLoading, error, refetchTenant }}>
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

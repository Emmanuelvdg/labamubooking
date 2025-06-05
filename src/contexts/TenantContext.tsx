
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const { user, loading: authLoading } = useAuth();

  const fetchUserTenants = async () => {
    if (authLoading) return;
    
    if (!user) {
      console.log('No user found, clearing tenant state');
      setTenantId(null);
      setAvailableTenants([]);
      setCurrentTenantRole(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      console.log('Fetching tenants for user:', user.id);
      
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
        console.error('Error fetching user tenants:', tenantsError);
        setError('Failed to load tenant information');
        setIsLoading(false);
        return;
      }

      console.log('Available tenants:', userTenants);
      setAvailableTenants(userTenants || []);
      
      if (userTenants && userTenants.length > 0) {
        // Sort tenants by role priority (owner > admin > user)
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
        console.log('Current tenant ID set to:', firstTenant.tenant_id, 'Role:', firstTenant.role);
      } else {
        console.log('No tenants found for user - clean slate for new business creation');
        setTenantId(null);
        setCurrentTenantRole(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Unexpected error fetching tenant:', err);
      setError('Failed to load tenant information');
      setTenantId(null);
      setCurrentTenantRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = (newTenantId: string) => {
    console.log('Switching to tenant:', newTenantId);
    setTenantId(newTenantId);
    
    const newTenant = availableTenants.find(ut => ut.tenant_id === newTenantId);
    setCurrentTenantRole(newTenant?.role || null);
  };

  const refetchTenant = async () => {
    console.log('Manual tenant refetch triggered - fetching fresh data');
    setIsLoading(true);
    setError(null);
    await fetchUserTenants();
  };

  useEffect(() => {
    console.log('TenantContext effect triggered - user:', !!user, 'authLoading:', authLoading);
    fetchUserTenants();
  }, [user, authLoading]);

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

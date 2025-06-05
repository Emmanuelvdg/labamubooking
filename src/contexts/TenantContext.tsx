
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserTenant {
  id: string;
  tenant_id: string;
  role: string;
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
      setTenantId(null);
      setAvailableTenants([]);
      setCurrentTenantRole(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      console.log('Fetching tenants for user:', user.id);
      
      // Get the current tenant ID using the updated function
      const { data: currentTenantId, error: tenantError } = await supabase.rpc('get_user_tenant_id');
      
      if (tenantError) {
        console.error('Error fetching current tenant:', tenantError);
        setError('Failed to load tenant information');
        return;
      }

      // Get all available tenants for the user
      const { data: userTenants, error: tenantsError } = await supabase
        .from('user_tenants')
        .select(`
          id,
          tenant_id,
          role,
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
        return;
      }

      console.log('Available tenants:', userTenants);
      setAvailableTenants(userTenants || []);
      
      if (currentTenantId) {
        setTenantId(currentTenantId);
        // Find the current tenant's role
        const currentTenant = userTenants?.find(ut => ut.tenant_id === currentTenantId);
        setCurrentTenantRole(currentTenant?.role || null);
        console.log('Current tenant ID:', currentTenantId, 'Role:', currentTenant?.role);
      } else {
        console.log('No tenant found for user');
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
    
    // Update the current tenant role
    const newTenant = availableTenants.find(ut => ut.tenant_id === newTenantId);
    setCurrentTenantRole(newTenant?.role || null);
    
    // You could implement additional logic here to persist the user's preference
    // For now, this will switch for the current session
  };

  const refetchTenant = async () => {
    setIsLoading(true);
    setError(null);
    await fetchUserTenants();
  };

  useEffect(() => {
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

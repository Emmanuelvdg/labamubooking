
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserTenant } from '@/types/tenantContext';

export const useTenantData = () => {
  const [availableTenants, setAvailableTenants] = useState<UserTenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Request management
  const abortControllerRef = useRef<AbortController | null>(null);
  const isRequestInProgressRef = useRef(false);

  const fetchTenants = useCallback(async (userId: string) => {
    // Prevent multiple concurrent requests
    if (isRequestInProgressRef.current) {
      console.log('[TENANT] Request already in progress, skipping');
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isRequestInProgressRef.current = true;

    try {
      console.log('[TENANT] Fetching tenants for user:', userId);
      
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
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .abortSignal(abortController.signal);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        console.log('[TENANT] Request was aborted');
        return;
      }

      if (tenantsError) {
        console.error('[TENANT] Error fetching tenants:', tenantsError);
        setError(`Failed to load tenant information: ${tenantsError.message}`);
        setAvailableTenants([]);
      } else {
        console.log('[TENANT] Tenants fetched successfully:', userTenants?.length || 0);
        setAvailableTenants(userTenants || []);
        setError(null);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[TENANT] Request was aborted');
        return;
      }
      
      console.error('[TENANT] Unexpected error:', err);
      setError('Failed to load tenant information');
      setAvailableTenants([]);
    } finally {
      isRequestInProgressRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    isRequestInProgressRef.current = false;
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  return {
    availableTenants,
    isLoading,
    error,
    fetchTenants,
    cleanup,
    refetch
  };
};

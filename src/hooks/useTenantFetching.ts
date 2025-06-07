
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserTenant } from '@/types/tenantContext';

export const useTenantFetching = () => {
  const [availableTenants, setAvailableTenants] = useState<UserTenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setAvailableTenants([]);
      setIsLoading(false);
      setError('Authentication required');
      return;
    }
    
    if (!user || !session) {
      console.log('[TENANT] No user or session found, clearing tenant state');
      setAvailableTenants([]);
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
    } finally {
      isRequestInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [user, authLoading, session, authError]);

  const cleanup = useCallback(() => {
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    isRequestInProgressRef.current = false;
  }, []);

  return {
    availableTenants,
    setAvailableTenants,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchUserTenants,
    cleanup
  };
};

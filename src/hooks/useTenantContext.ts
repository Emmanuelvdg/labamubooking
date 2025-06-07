
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TenantContextState {
  currentTenantId: string | null;
  sessionToken: string | null;
  isContextSet: boolean;
  error: string | null;
}

export const useTenantContext = () => {
  const [contextState, setContextState] = useState<TenantContextState>({
    currentTenantId: null,
    sessionToken: null,
    isContextSet: false,
    error: null
  });
  
  const { user } = useAuth();

  const setTenantContext = useCallback(async (tenantId: string) => {
    if (!user) {
      setContextState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      console.log('[TENANT CONTEXT] Setting tenant context for:', tenantId);
      
      // Generate session token
      const sessionToken = crypto.randomUUID();
      
      // Call the database function to set tenant context
      const { data, error } = await supabase.rpc('set_tenant_context', {
        p_tenant_id: tenantId,
        p_session_token: sessionToken
      });

      if (error) {
        console.error('[TENANT CONTEXT] Error setting context:', error);
        setContextState(prev => ({ 
          ...prev, 
          error: `Failed to set tenant context: ${error.message}` 
        }));
        return false;
      }

      console.log('[TENANT CONTEXT] Context set successfully, context ID:', data);
      
      setContextState({
        currentTenantId: tenantId,
        sessionToken,
        isContextSet: true,
        error: null
      });

      return true;
    } catch (error) {
      console.error('[TENANT CONTEXT] Unexpected error:', error);
      setContextState(prev => ({ 
        ...prev, 
        error: 'Unexpected error setting tenant context' 
      }));
      return false;
    }
  }, [user]);

  const refreshTenantContext = useCallback(async () => {
    if (!user || !contextState.isContextSet) {
      return false;
    }

    try {
      console.log('[TENANT CONTEXT] Refreshing tenant context');
      
      const { data, error } = await supabase.rpc('refresh_tenant_context');

      if (error) {
        console.error('[TENANT CONTEXT] Error refreshing context:', error);
        setContextState(prev => ({ 
          ...prev, 
          error: 'Failed to refresh tenant context' 
        }));
        return false;
      }

      console.log('[TENANT CONTEXT] Context refreshed successfully');
      return data;
    } catch (error) {
      console.error('[TENANT CONTEXT] Unexpected error refreshing context:', error);
      return false;
    }
  }, [user, contextState.isContextSet]);

  const clearTenantContext = useCallback(() => {
    console.log('[TENANT CONTEXT] Clearing tenant context');
    setContextState({
      currentTenantId: null,
      sessionToken: null,
      isContextSet: false,
      error: null
    });
  }, []);

  const getCurrentTenantId = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_current_tenant_id');
      
      if (error) {
        console.error('[TENANT CONTEXT] Error getting current tenant:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[TENANT CONTEXT] Unexpected error getting current tenant:', error);
      return null;
    }
  }, [user]);

  return {
    ...contextState,
    setTenantContext,
    refreshTenantContext,
    clearTenantContext,
    getCurrentTenantId
  };
};

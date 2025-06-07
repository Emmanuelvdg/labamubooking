
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  isConnected: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isConnected: true
  });

  // Simplified auth state change handler
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    console.log(`[AUTH] State changed: ${event}`, session?.user?.email);
    
    setAuthState(prev => ({
      ...prev,
      session,
      user: session?.user ?? null,
      error: null,
      loading: false
    }));
  }, []);

  useEffect(() => {
    let mounted = true;
    
    console.log('[AUTH] Initializing authentication');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('[AUTH] Initial session error:', error);
            setAuthState(prev => ({ 
              ...prev, 
              user: null, 
              session: null, 
              error, 
              loading: false 
            }));
          } else {
            console.log('[AUTH] Initial session loaded:', session?.user?.email);
            setAuthState(prev => ({ 
              ...prev, 
              user: session?.user ?? null, 
              session, 
              error: null, 
              loading: false 
            }));
          }
        }
      } catch (error) {
        console.error('[AUTH] Initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            user: null, 
            session: null, 
            error: error as AuthError, 
            loading: false 
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Simplified recovery function
  const forceSessionRecovery = useCallback(async () => {
    console.log('[AUTH] Attempting session recovery');
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('[AUTH] Recovery failed:', error);
      return false;
    }
  }, []);

  // Simplified debug info
  const getDebugInfo = useCallback(() => {
    return {
      hasUser: !!authState.user,
      hasSession: !!authState.session,
      loading: authState.loading,
      error: authState.error?.message,
      isConnected: authState.isConnected
    };
  }, [authState]);

  return { 
    ...authState, 
    forceSessionRecovery, 
    getDebugInfo,
    lastHeartbeat: new Date().toISOString()
  };
};

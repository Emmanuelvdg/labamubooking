
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, clearStoredSession } from '@/integrations/supabase/client';

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

  // Enhanced auth state change handler with better error handling
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    console.log(`[AUTH] State changed: ${event}`, session?.user?.email);
    
    // If we get a SIGNED_OUT event but still have a stored session, clear it
    if (event === 'SIGNED_OUT' && !session) {
      clearStoredSession();
    }
    
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

    // Get initial session with better error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('[AUTH] Initial session error:', error);
            // If session is invalid, clear stored data
            if (error.message.includes('session_not_found') || error.message.includes('invalid')) {
              clearStoredSession();
            }
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
          // Clear potentially corrupted session data
          clearStoredSession();
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

  // Enhanced recovery function with session cleanup
  const forceSessionRecovery = useCallback(async () => {
    console.log('[AUTH] Attempting session recovery');
    try {
      // First try to refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        // If refresh fails, clear everything and redirect to login
        console.warn('[AUTH] Session refresh failed, clearing session:', error);
        clearStoredSession();
        setAuthState(prev => ({
          ...prev,
          session: null,
          user: null,
          error
        }));
        return false;
      }
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('[AUTH] Recovery failed:', error);
      // Clear session data on recovery failure
      clearStoredSession();
      setAuthState(prev => ({
        ...prev,
        session: null,
        user: null,
        error: error as AuthError
      }));
      return false;
    }
  }, []);

  // Enhanced debug info
  const getDebugInfo = useCallback(() => {
    return {
      hasUser: !!authState.user,
      hasSession: !!authState.session,
      loading: authState.loading,
      error: authState.error?.message,
      isConnected: authState.isConnected,
      sessionExpiry: authState.session?.expires_at ? new Date(authState.session.expires_at * 1000).toISOString() : null
    };
  }, [authState]);

  return { 
    ...authState, 
    forceSessionRecovery, 
    getDebugInfo,
    lastHeartbeat: new Date().toISOString()
  };
};

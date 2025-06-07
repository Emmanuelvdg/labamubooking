
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  const updateAuthState = useCallback((session: Session | null, error: AuthError | null = null) => {
    setAuthState({
      user: session?.user ?? null,
      session,
      loading: false,
      error
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log('[AUTH] State change:', event, session?.user?.email);
        updateAuthState(session);
      }
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (mounted) {
          if (error) {
            console.error('[AUTH] Initial session error:', error);
            updateAuthState(null, error);
          } else {
            console.log('[AUTH] Initial session:', session?.user?.email);
            updateAuthState(session);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('[AUTH] Unexpected error:', error);
          updateAuthState(null, error as AuthError);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  return authState;
};

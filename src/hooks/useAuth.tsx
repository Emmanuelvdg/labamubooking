
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection, getStoredSession, clearStoredSession } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  isConnected: boolean;
}

interface AuthRecoveryAttempt {
  timestamp: number;
  successful: boolean;
  error?: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isConnected: true
  });

  const [recoveryAttempts, setRecoveryAttempts] = useState<AuthRecoveryAttempt[]>([]);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(Date.now());

  // Enhanced logging function
  const logAuthEvent = useCallback((event: string, data?: any, isError = false) => {
    const timestamp = new Date().toISOString();
    const logLevel = isError ? 'error' : 'info';
    console[logLevel](`[AUTH ${timestamp}] ${event}`, data || '');
    
    // Store critical events for debugging
    if (isError || event.includes('FAILURE') || event.includes('RECOVERY')) {
      const storageKey = 'labamu-auth-debug-log';
      try {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newLog = { timestamp, event, data: data || {}, isError };
        const updatedLog = [...existing, newLog].slice(-50); // Keep last 50 entries
        localStorage.setItem(storageKey, JSON.stringify(updatedLog));
      } catch (error) {
        console.error('Failed to store debug log:', error);
      }
    }
  }, []);

  // Connection health monitor
  const checkConnectionHealth = useCallback(async () => {
    try {
      const isConnected = await checkSupabaseConnection();
      setAuthState(prev => ({ ...prev, isConnected }));
      
      if (!isConnected) {
        logAuthEvent('CONNECTION_HEALTH_CHECK_FAILED', null, true);
      } else {
        setLastHeartbeat(Date.now());
      }
      
      return isConnected;
    } catch (error) {
      logAuthEvent('CONNECTION_HEALTH_CHECK_ERROR', error, true);
      setAuthState(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  }, [logAuthEvent]);

  // Session recovery mechanism
  const attemptSessionRecovery = useCallback(async () => {
    logAuthEvent('SESSION_RECOVERY_ATTEMPT_STARTED');
    
    try {
      // First, check if we have a stored session
      const storedSession = getStoredSession();
      if (storedSession && storedSession.access_token) {
        logAuthEvent('STORED_SESSION_FOUND', { 
          expires_at: storedSession.expires_at,
          user_id: storedSession.user?.id 
        });
      }

      // Attempt to refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logAuthEvent('SESSION_RECOVERY_REFRESH_FAILED', error, true);
        
        // If refresh fails, try to get the current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          logAuthEvent('SESSION_RECOVERY_GET_SESSION_FAILED', sessionError, true);
          
          // Clear potentially corrupted session data
          clearStoredSession();
          await supabase.auth.signOut();
          
          setRecoveryAttempts(prev => [...prev, {
            timestamp: Date.now(),
            successful: false,
            error: error.message || sessionError?.message
          }]);
          
          setAuthState(prev => ({ 
            ...prev, 
            user: null, 
            session: null, 
            error: error || sessionError 
          }));
          
          return false;
        } else {
          // We have a valid session despite refresh error
          logAuthEvent('SESSION_RECOVERY_FALLBACK_SUCCESS', { user_id: currentSession.user.id });
          setAuthState(prev => ({ 
            ...prev, 
            user: currentSession.user, 
            session: currentSession, 
            error: null 
          }));
          
          setRecoveryAttempts(prev => [...prev, {
            timestamp: Date.now(),
            successful: true
          }]);
          
          return true;
        }
      } else if (session) {
        logAuthEvent('SESSION_RECOVERY_SUCCESS', { user_id: session.user.id });
        setAuthState(prev => ({ 
          ...prev, 
          user: session.user, 
          session, 
          error: null 
        }));
        
        setRecoveryAttempts(prev => [...prev, {
          timestamp: Date.now(),
          successful: true
        }]);
        
        return true;
      }
      
      return false;
    } catch (error) {
      logAuthEvent('SESSION_RECOVERY_UNEXPECTED_ERROR', error, true);
      setRecoveryAttempts(prev => [...prev, {
        timestamp: Date.now(),
        successful: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
      return false;
    }
  }, [logAuthEvent]);

  // Enhanced auth state change handler
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    logAuthEvent(`AUTH_STATE_CHANGED: ${event}`, {
      user_email: session?.user?.email,
      session_id: session?.access_token?.substring(0, 10) + '...',
      expires_at: session?.expires_at
    });

    // Update state immediately for all events
    setAuthState(prev => ({
      ...prev,
      session,
      user: session?.user ?? null,
      error: null,
      loading: false
    }));

    // Handle specific events
    switch (event) {
      case 'SIGNED_IN':
        logAuthEvent('USER_SIGNED_IN_PROCESSING');
        // Add extra delay for database consistency
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
        
      case 'TOKEN_REFRESHED':
        logAuthEvent('TOKEN_REFRESHED_SUCCESSFULLY');
        setLastHeartbeat(Date.now());
        break;
        
      case 'SIGNED_OUT':
        logAuthEvent('USER_SIGNED_OUT');
        clearStoredSession();
        break;
        
      case 'PASSWORD_RECOVERY':
        logAuthEvent('PASSWORD_RECOVERY_INITIATED');
        break;
        
      default:
        logAuthEvent(`UNHANDLED_AUTH_EVENT: ${event}`);
    }
  }, [logAuthEvent]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    logAuthEvent('AUTH_INITIALIZATION_STARTED');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initialize session check
    const initializeAuth = async () => {
      try {
        // Check connection health first
        const isConnected = await checkConnectionHealth();
        if (!isConnected && mounted) {
          logAuthEvent('INITIALIZATION_CONNECTION_FAILED', null, true);
          setAuthState(prev => ({ ...prev, loading: false, isConnected: false }));
          return;
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logAuthEvent('INITIALIZATION_SESSION_ERROR', error, true);
          
          // Attempt recovery if session retrieval fails
          const recoverySuccess = await attemptSessionRecovery();
          if (!recoverySuccess && mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              user: null, 
              session: null, 
              error, 
              loading: false 
            }));
          }
        } else {
          if (session && mounted) {
            logAuthEvent('INITIALIZATION_SESSION_FOUND', { 
              user_email: session.user.email,
              session_id: session.access_token.substring(0, 10) + '...'
            });
            setAuthState(prev => ({ 
              ...prev, 
              user: session.user, 
              session, 
              error: null, 
              loading: false 
            }));
          } else if (mounted) {
            logAuthEvent('INITIALIZATION_NO_SESSION');
            setAuthState(prev => ({ 
              ...prev, 
              user: null, 
              session: null, 
              error: null, 
              loading: false 
            }));
          }
        }
      } catch (error) {
        logAuthEvent('INITIALIZATION_UNEXPECTED_ERROR', error, true);
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

    // Set up periodic health checks
    const healthCheckInterval = setInterval(async () => {
      if (mounted) {
        await checkConnectionHealth();
        
        // Check if session might need recovery (heartbeat older than 5 minutes)
        const timeSinceLastHeartbeat = Date.now() - lastHeartbeat;
        if (timeSinceLastHeartbeat > 5 * 60 * 1000 && authState.session) {
          logAuthEvent('HEARTBEAT_TIMEOUT_DETECTED', { timeSinceLastHeartbeat });
          await attemptSessionRecovery();
        }
      }
    }, 60000); // Check every minute

    return () => {
      mounted = false;
      logAuthEvent('AUTH_CLEANUP_STARTED');
      subscription.unsubscribe();
      clearInterval(healthCheckInterval);
    };
  }, [handleAuthStateChange, checkConnectionHealth, attemptSessionRecovery, lastHeartbeat, authState.session]);

  // Expose recovery function for manual use
  const forceSessionRecovery = useCallback(async () => {
    logAuthEvent('MANUAL_SESSION_RECOVERY_TRIGGERED');
    return await attemptSessionRecovery();
  }, [attemptSessionRecovery]);

  // Get debug information
  const getDebugInfo = useCallback(() => {
    try {
      const debugLog = JSON.parse(localStorage.getItem('labamu-auth-debug-log') || '[]');
      return {
        currentState: {
          hasUser: !!authState.user,
          hasSession: !!authState.session,
          loading: authState.loading,
          error: authState.error?.message,
          isConnected: authState.isConnected
        },
        recoveryAttempts: recoveryAttempts.slice(-10), // Last 10 attempts
        recentEvents: debugLog.slice(-20), // Last 20 events
        lastHeartbeat: new Date(lastHeartbeat).toISOString(),
        storedSession: !!getStoredSession()
      };
    } catch (error) {
      logAuthEvent('DEBUG_INFO_ERROR', error, true);
      return { error: 'Failed to retrieve debug info' };
    }
  }, [authState, recoveryAttempts, lastHeartbeat, logAuthEvent]);

  return { 
    ...authState, 
    forceSessionRecovery, 
    getDebugInfo,
    lastHeartbeat: new Date(lastHeartbeat).toISOString()
  };
};

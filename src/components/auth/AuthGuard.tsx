
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading, error, isConnected, forceSessionRecovery } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRecoveryOptions, setShowRecoveryOptions] = useState(false);
  const [recoveryAttempting, setRecoveryAttempting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== '/auth' && location.pathname !== '/tenant/create' && location.pathname !== '/') {
        console.log('[GUARD] User not authenticated, redirecting to auth');
        navigate('/auth');
      } else if (user && (location.pathname === '/auth' || location.pathname === '/')) {
        console.log('[GUARD] User authenticated, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  // Show recovery options if there's an auth error and we're not on public pages
  useEffect(() => {
    const publicPages = ['/auth', '/tenant/create', '/'];
    const isOnPublicPage = publicPages.includes(location.pathname);
    
    if (error && !loading && !isOnPublicPage && !user) {
      const timer = setTimeout(() => {
        setShowRecoveryOptions(true);
      }, 3000); // Show recovery options after 3 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowRecoveryOptions(false);
    }
  }, [error, loading, location.pathname, user]);

  const handleRecoveryAttempt = async () => {
    setRecoveryAttempting(true);
    try {
      const success = await forceSessionRecovery();
      if (!success) {
        console.log('[GUARD] Recovery failed, redirecting to auth');
        navigate('/auth');
      }
    } catch (err) {
      console.error('[GUARD] Recovery attempt failed:', err);
      navigate('/auth');
    } finally {
      setRecoveryAttempting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
          {!isConnected && (
            <p className="mt-1 text-sm text-orange-600">Connection issues detected</p>
          )}
        </div>
      </div>
    );
  }

  // Show recovery interface if there are auth errors
  if (showRecoveryOptions && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Authentication Issue</h3>
            <p className="mt-1 text-sm text-gray-500">
              We're having trouble with your authentication session.
            </p>
            {error && (
              <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                {error.message}
              </p>
            )}
            {!isConnected && (
              <p className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                Connection to authentication service is unstable
              </p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={handleRecoveryAttempt}
              disabled={recoveryAttempting}
              className="w-full"
            >
              {recoveryAttempting ? 'Attempting Recovery...' : 'Try to Recover Session'}
            </Button>
            
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="w-full"
            >
              Go to Login Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

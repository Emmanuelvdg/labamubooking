
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { supabase, clearStoredSession } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { useTenantContext } from '@/hooks/useTenantContext';
import { TenantSelector } from '@/components/tenant/TenantSelector';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const { user, error: authError, isConnected, forceSessionRecovery } = useAuth();
  const { availableTenants, tenantId } = useTenant();
  const { isContextSet, error: tenantContextError } = useTenantContext();
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // First try normal logout
      const { error } = await supabase.auth.signOut();
      
      // If logout fails (like with 403 session_not_found), force clear everything
      if (error) {
        console.warn('Normal logout failed, forcing session cleanup:', error);
        // Clear all stored session data
        clearStoredSession();
        // Force reload to ensure clean state
        window.location.href = '/auth';
        return;
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear session data and reload
      clearStoredSession();
      window.location.href = '/auth';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleSessionRecovery = async () => {
    setIsRecovering(true);
    try {
      await forceSessionRecovery();
    } catch (error) {
      console.error('Recovery failed:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  // Show tenant context status
  const showTenantWarning = tenantId && !isContextSet;
  const currentTenant = availableTenants.find(t => t.tenant_id === tenantId);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">LabamuBooking</h1>
          {availableTenants.length > 1 && <TenantSelector />}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Security and status indicators */}
          <div className="flex items-center space-x-2">
            {/* Tenant context status */}
            {showTenantWarning && (
              <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">
                <Shield className="h-3 w-3" />
                <span>Tenant Context Required</span>
              </div>
            )}
            
            {tenantContextError && (
              <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Context Error</span>
              </div>
            )}

            {authError && (
              <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Auth Issue</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSessionRecovery}
                  disabled={isRecovering}
                  className="h-6 px-2 ml-1"
                >
                  {isRecovering ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    'Recover'
                  )}
                </Button>
              </div>
            )}
            
            {!isConnected && (
              <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Connection Issue</span>
              </div>
            )}

            {/* Tenant security indicator */}
            {isContextSet && currentTenant && (
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                <Shield className="h-3 w-3" />
                <span>Secure: {currentTenant.tenant.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettings}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2"
          >
            {isLoggingOut ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

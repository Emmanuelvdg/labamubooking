
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { TenantSelector } from '@/components/tenant/TenantSelector';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const { user, error: authError, isConnected, forceSessionRecovery, getDebugInfo } = useAuth();
  const { availableTenants } = useTenant();
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  const handleDebugInfo = () => {
    const debugInfo = getDebugInfo();
    console.log('Header Debug Info:', debugInfo);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2)).then(() => {
        alert('Debug info copied to clipboard');
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">LabamuBooking</h1>
          {availableTenants.length > 1 && <TenantSelector />}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Auth status indicators */}
          <div className="flex items-center space-x-2">
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
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>

          {/* Debug button (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDebugInfo}
              className="text-xs text-gray-400"
            >
              Debug
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

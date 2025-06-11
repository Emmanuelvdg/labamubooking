
import { createContext, useContext } from 'react';
import { TenantContextType } from '@/types/tenantContext';

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Re-export TenantProvider from the providers directory for convenience
export { TenantProvider } from '@/components/providers/TenantProvider';

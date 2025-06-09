
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSyncCustomers } from '@/hooks/useSyncCustomers';

interface SyncCustomersButtonProps {
  tenantId: string;
}

export const SyncCustomersButton = ({ tenantId }: SyncCustomersButtonProps) => {
  const syncCustomers = useSyncCustomers();

  const handleSync = () => {
    syncCustomers.mutate(tenantId);
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={syncCustomers.isPending}
      variant="outline"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${syncCustomers.isPending ? 'animate-spin' : ''}`} />
      {syncCustomers.isPending ? 'Syncing...' : 'Sync with Labamu'}
    </Button>
  );
};

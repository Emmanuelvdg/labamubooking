
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSyncServices } from '@/hooks/useSyncServices';

interface SyncServicesButtonProps {
  tenantId: string;
}

export const SyncServicesButton = ({ tenantId }: SyncServicesButtonProps) => {
  const syncServices = useSyncServices();

  const handleSync = () => {
    syncServices.mutate(tenantId);
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={syncServices.isPending}
      variant="outline"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${syncServices.isPending ? 'animate-spin' : ''}`} />
      {syncServices.isPending ? 'Syncing...' : 'Sync with Labamu'}
    </Button>
  );
};

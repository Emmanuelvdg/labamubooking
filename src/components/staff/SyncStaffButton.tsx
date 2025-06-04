
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSyncStaff } from '@/hooks/useSyncStaff';

interface SyncStaffButtonProps {
  tenantId: string;
}

export const SyncStaffButton = ({ tenantId }: SyncStaffButtonProps) => {
  const syncStaff = useSyncStaff();

  const handleSync = () => {
    syncStaff.mutate(tenantId);
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={syncStaff.isPending}
      variant="outline"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${syncStaff.isPending ? 'animate-spin' : ''}`} />
      {syncStaff.isPending ? 'Syncing...' : 'Sync Staff'}
    </Button>
  );
};

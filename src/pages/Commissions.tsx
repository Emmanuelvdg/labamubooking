
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewCommissionSchemeDialog } from '@/components/commissions/NewCommissionSchemeDialog';
import { CommissionSchemesTable } from '@/components/commissions/CommissionSchemesTable';
import { CommissionRecordsTable } from '@/components/commissions/CommissionRecordsTable';
import { useTenant } from '@/contexts/TenantContext';

const Commissions = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading commissions...</div>
      </div>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          {tenantError || 'No tenant access found. Please contact support.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
          <p className="text-gray-600">Manage staff commission schemes and track earnings</p>
        </div>
        <NewCommissionSchemeDialog tenantId={tenantId} />
      </div>

      <Tabs defaultValue="schemes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schemes">Commission Schemes</TabsTrigger>
          <TabsTrigger value="records">Commission Records</TabsTrigger>
        </TabsList>

        <TabsContent value="schemes">
          <CommissionSchemesTable tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="records">
          <CommissionRecordsTable tenantId={tenantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commissions;


import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewCommissionSchemeDialog } from '@/components/commissions/NewCommissionSchemeDialog';
import { CommissionSchemesTable } from '@/components/commissions/CommissionSchemesTable';
import { CommissionRecordsTable } from '@/components/commissions/CommissionRecordsTable';

const Commissions = () => {
  const tenantId = '00000000-0000-0000-0000-000000000001';

  return (
    <Layout>
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
    </Layout>
  );
};

export default Commissions;

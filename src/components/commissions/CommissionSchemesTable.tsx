
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCommissionSchemes, useUpdateCommissionScheme } from '@/hooks/useCommissionSchemes';
import { Settings } from 'lucide-react';

interface CommissionSchemesTableProps {
  tenantId: string;
}

export const CommissionSchemesTable = ({ tenantId }: CommissionSchemesTableProps) => {
  const { data: schemes, isLoading } = useCommissionSchemes(tenantId);
  const updateScheme = useUpdateCommissionScheme();

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateScheme.mutate({ id, updates: { isActive: !isActive } });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading commission schemes...</p>
        </CardContent>
      </Card>
    );
  }

  if (!schemes || schemes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No commission schemes found</p>
            <p className="text-sm mt-2">Create your first commission scheme to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Schemes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{scheme.staff?.name}</h3>
                  <Badge variant={scheme.isActive ? "default" : "secondary"}>
                    {scheme.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Service: {scheme.service?.name || "All Services"}</p>
                  <p>
                    Commission: {scheme.commissionValue}
                    {scheme.commissionType === 'percentage' ? '%' : ' $'}
                    {scheme.commissionType === 'percentage' ? ' of service price' : ' per booking'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={scheme.isActive}
                  onCheckedChange={() => handleToggleActive(scheme.id, scheme.isActive)}
                />
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommissionRecords, useMarkCommissionPaid } from '@/hooks/useCommissionRecords';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

interface CommissionRecordsTableProps {
  tenantId: string;
}

export const CommissionRecordsTable = ({ tenantId }: CommissionRecordsTableProps) => {
  const { data: records, isLoading } = useCommissionRecords(tenantId);
  const markPaid = useMarkCommissionPaid();

  const handleMarkPaid = (recordId: string) => {
    markPaid.mutate(recordId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading commission records...</p>
        </CardContent>
      </Card>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No commission records found</p>
            <p className="text-sm mt-2">Commission records will appear when bookings are completed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUnpaid = records
    .filter(record => !record.isPaid)
    .reduce((sum, record) => sum + record.commissionAmount, 0);

  const totalPaid = records
    .filter(record => record.isPaid)
    .reduce((sum, record) => sum + record.commissionAmount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Unpaid</p>
                <p className="text-2xl font-bold text-orange-600">Rp{totalUnpaid.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">Rp{totalPaid.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold">Rp{(totalUnpaid + totalPaid).toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{record.staff.name}</h3>
                    <Badge variant={record.isPaid ? "default" : "secondary"}>
                      {record.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Service: {record.service.name}</p>
                    <p>Service Price: Rp{record.servicePrice.toFixed(0)}</p>
                    <p>
                      Commission: {record.commissionValue}
                      {record.commissionType === 'percentage' ? '%' : 'Rp'} = 
                      <span className="font-medium text-green-600 ml-1">
                        Rp{record.commissionAmount.toFixed(0)}
                      </span>
                    </p>
                    <p>Date: {format(new Date(record.createdAt), 'MMM dd, yyyy')}</p>
                    {record.isPaid && record.paidAt && (
                      <p>Paid: {format(new Date(record.paidAt), 'MMM dd, yyyy')}</p>
                    )}
                  </div>
                </div>
                {!record.isPaid && (
                  <Button 
                    onClick={() => handleMarkPaid(record.id)}
                    disabled={markPaid.isPending}
                    size="sm"
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';

interface EditHistoryProps {
  bookingEdits: any[];
}

export const EditHistory = ({ bookingEdits }: EditHistoryProps) => {
  if (!bookingEdits || bookingEdits.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Edit History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookingEdits.map((edit) => (
            <div key={edit.id} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline">{edit.editType.replace('_', ' ')}</Badge>
                <span className="text-xs text-gray-500">
                  {new Date(edit.createdAt).toLocaleString()}
                </span>
              </div>
              {edit.reason && (
                <p className="text-sm text-gray-600">{edit.reason}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

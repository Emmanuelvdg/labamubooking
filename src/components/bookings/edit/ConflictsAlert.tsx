
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ConflictsAlertProps {
  conflicts: any[];
}

export const ConflictsAlert = ({ conflicts }: ConflictsAlertProps) => {
  if (conflicts.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-yellow-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Booking Conflicts Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conflicts.map((conflict, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <span className="text-sm text-yellow-700">
              {conflict.conflict_type.replace('_', ' ').toUpperCase()}
            </span>
            <Badge variant={conflict.severity === 'error' ? 'destructive' : 'secondary'}>
              {conflict.severity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScheduleConflict } from '@/hooks/useScheduleConflictDetection';

interface ConflictDetectionPanelProps {
  conflicts: ScheduleConflict[];
  isChecking: boolean;
}

export const ConflictDetectionPanel = ({ conflicts, isChecking }: ConflictDetectionPanelProps) => {
  if (isChecking) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Checking for conflicts...</AlertTitle>
        <AlertDescription>
          Please wait while we verify there are no scheduling conflicts.
        </AlertDescription>
      </Alert>
    );
  }

  if (conflicts.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Info className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">No conflicts detected</AlertTitle>
        <AlertDescription className="text-green-700">
          This schedule can be created without any conflicts.
        </AlertDescription>
      </Alert>
    );
  }

  const errorConflicts = conflicts.filter(c => c.severity === 'error');
  const warningConflicts = conflicts.filter(c => c.severity === 'warning');
  const infoConflicts = conflicts.filter(c => c.severity === 'info');

  return (
    <div className="space-y-3">
      {errorConflicts.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Schedule Conflicts Found</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {errorConflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between">
                  <span className="text-sm">{conflict.message}</span>
                  <Badge variant="destructive">Error</Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {warningConflicts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Potential Issues</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {warningConflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700">{conflict.message}</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    Warning
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {infoConflicts.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Information</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {infoConflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">{conflict.message}</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Info
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

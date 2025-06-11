
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PublicBookingErrorProps {
  error: any;
}

export const PublicBookingError = ({ error }: PublicBookingErrorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Business Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The business you're looking for is not available for online booking or doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            Error: {error?.message || 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

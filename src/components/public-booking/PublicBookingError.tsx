
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PublicBookingErrorProps {
  error: any;
  slug?: string;
}

export const PublicBookingError = ({ error, slug }: PublicBookingErrorProps) => {
  const isBusinessNotFound = !error || error.message?.includes('JSON object requested') || error.message?.includes('No rows');
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          
          {isBusinessNotFound ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Business Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                No public booking page exists for "{slug}". The business owner needs to set up their public booking profile first.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  For Business Owners:
                </p>
                <p className="text-sm text-blue-700">
                  Go to Settings → Business Settings to create your public booking profile and enable online bookings.
                </p>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something Went Wrong
              </h3>
              <p className="text-gray-600 mb-4">
                We encountered an error while loading the booking page. Please try again later.
              </p>
              <p className="text-sm text-gray-500">
                Error: {error?.message || 'Unknown error'}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

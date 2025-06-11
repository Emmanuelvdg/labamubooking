
import { Skeleton } from '@/components/ui/skeleton';

export const PublicBookingLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
      </div>

      {/* Form skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

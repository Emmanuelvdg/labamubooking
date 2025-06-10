
import { CalendarWithWaitlist } from '@/components/calendar/CalendarWithWaitlist';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useTenant } from '@/contexts/TenantContext';

const Calendar = () => {
  const { tenantId, isLoading } = useTenant();

  console.log('Calendar page: tenantId:', tenantId, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendar & Waitlist</h1>
          <p className="text-gray-600 mt-2">
            Manage appointments and waitlist in one place
          </p>
          {tenantId && (
            <p className="text-xs text-gray-500 mt-1">
              Tenant ID: {tenantId}
            </p>
          )}
        </div>
        <CalendarWithWaitlist />
      </div>
    </AuthGuard>
  );
};

export default Calendar;


import { CalendarWithWaitlist } from '@/components/calendar/CalendarWithWaitlist';
import { AuthGuard } from '@/components/auth/AuthGuard';

const Calendar = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Calendar & Waitlist</h1>
          <p className="text-gray-600 mt-2">
            Manage appointments and waitlist in one place
          </p>
        </div>
        <CalendarWithWaitlist />
      </div>
    </AuthGuard>
  );
};

export default Calendar;

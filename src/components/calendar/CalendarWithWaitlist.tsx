
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarGrid } from './CalendarGrid';
import { DailyCalendarView } from './DailyCalendarView';
import { WaitlistPanel } from './WaitlistPanel';
import { useBookings } from '@/hooks/useBookings';
import { useStaff } from '@/hooks/useStaff';
import { useTenantContext } from '@/hooks/useTenantContext';
import { Booking } from '@/types';

export const CalendarWithWaitlist = () => {
  const [viewType, setViewType] = useState<'month' | 'day' | 'waitlist'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentTenantId } = useTenantContext();

  const { data: bookings = [] } = useBookings(currentTenantId || '');
  const { data: staff = [] } = useStaff(currentTenantId || '');

  // Get current month for filtering
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Filter bookings for the current month
  const monthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.getMonth() === currentDate.getMonth() && 
           bookingDate.getFullYear() === currentDate.getFullYear();
  });

  // Group bookings by day for the current month
  const bookingsByDay = monthBookings.reduce((acc, booking) => {
    const day = new Date(booking.startTime).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(booking);
    return acc;
  }, {} as Record<number, Booking[]>);

  // Get bookings for selected date (for day view)
  const selectedDateBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === selectedDate.toDateString();
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    // For now, we'll just log this - the month navigation will be handled in CalendarGrid
    console.log('Navigate month:', direction);
  };

  const formatBookingTime = (booking: Booking) => {
    return new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'month' | 'day' | 'waitlist')}>
        <TabsList>
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="day">Day View</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value="month">
          <CalendarGrid
            currentMonth={currentMonth}
            currentDate={currentDate}
            bookingsByDay={bookingsByDay}
            formatBookingTime={formatBookingTime}
            onNavigateMonth={navigateMonth}
          />
        </TabsContent>

        <TabsContent value="day">
          <DailyCalendarView
            selectedDate={selectedDate}
            staff={staff || []}
            bookings={selectedDateBookings || []}
            formatBookingTime={formatBookingTime}
            onDateChange={setSelectedDate}
          />
        </TabsContent>

        <TabsContent value="waitlist">
          <WaitlistPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

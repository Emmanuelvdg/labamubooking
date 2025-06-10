
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarGrid } from './CalendarGrid';
import { DailyCalendarView } from './DailyCalendarView';
import { WaitlistPanel } from './WaitlistPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenantContext } from '@/hooks/useTenantContext';

export const CalendarWithWaitlist = () => {
  const [viewType, setViewType] = useState<'month' | 'day' | 'waitlist'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentTenantId } = useTenantContext();

  const {
    currentDate,
    currentMonth,
    staff,
    bookingsByDay,
    formatBookingTime,
    navigateMonth,
    getBookingsForDate
  } = useCalendar(currentTenantId);

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    navigateMonth(direction);
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
            onNavigateMonth={handleNavigateMonth}
          />
        </TabsContent>

        <TabsContent value="day">
          <DailyCalendarView
            selectedDate={selectedDate}
            staff={staff || []}
            bookings={getBookingsForDate(selectedDate) || []}
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


import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarGrid } from './CalendarGrid';
import { DailyCalendarView } from './DailyCalendarView';
import { WaitlistPanel } from './WaitlistPanel';
import { useCalendarData } from '@/hooks/useCalendarData';
import { format } from 'date-fns';

export const CalendarWithWaitlist = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'day' | 'waitlist'>('month');

  const {
    bookings,
    staff,
    bookingsByDay,
    formatBookingTime,
    isLoading
  } = useCalendarData(currentDate);

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading calendar...</div>;
  }

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
            currentMonth={format(currentDate, 'MMMM yyyy')}
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
            bookings={bookings || []}
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

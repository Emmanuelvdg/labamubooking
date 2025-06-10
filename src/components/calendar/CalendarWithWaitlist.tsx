
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarGrid } from './CalendarGrid';
import { DailyCalendarView } from './DailyCalendarView';
import { WaitlistPanel } from './WaitlistPanel';
import { CalendarFilters } from './CalendarFilters';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenantContext } from '@/hooks/useTenantContext';

export const CalendarWithWaitlist = () => {
  const [viewType, setViewType] = useState<'month' | 'day' | 'waitlist'>('month');
  const { currentTenantId } = useTenantContext();

  const {
    currentDate,
    selectedDate,
    currentMonth,
    selectedStaffId,
    selectedServiceId,
    staff,
    services,
    monthBookings,
    bookingsByDay,
    selectedDateBookings,
    navigateMonth,
    formatBookingTime,
    clearFilters,
    setSelectedDate,
    setSelectedStaffId,
    setSelectedServiceId,
  } = useCalendar(currentTenantId || '');

  const hasActiveFilters = selectedStaffId !== 'all' || selectedServiceId !== 'all';

  console.log('CalendarWithWaitlist render:', {
    viewType,
    currentMonth,
    monthBookingsCount: monthBookings.length,
    selectedDateBookingsCount: selectedDateBookings.length,
    hasActiveFilters
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CalendarFilters
        selectedStaffId={selectedStaffId}
        selectedServiceId={selectedServiceId}
        staff={staff}
        services={services}
        filteredBookingsCount={monthBookings.length}
        currentMonth={currentMonth}
        onStaffChange={setSelectedStaffId}
        onServiceChange={setSelectedServiceId}
        onClearFilters={clearFilters}
      />

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

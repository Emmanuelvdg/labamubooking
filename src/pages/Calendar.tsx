
import { Layout } from '@/components/layout/Layout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { useCalendar } from '@/hooks/useCalendar';

const Calendar = () => {
  const tenantId = '00000000-0000-0000-0000-000000000001';
  
  const {
    currentDate,
    currentMonth,
    selectedStaffId,
    selectedServiceId,
    staff,
    services,
    monthBookings,
    bookingsByDay,
    navigateMonth,
    formatBookingTime,
    clearFilters,
    setSelectedStaffId,
    setSelectedServiceId,
  } = useCalendar(tenantId);

  return (
    <Layout>
      <div className="space-y-6">
        <CalendarHeader />

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

        <CalendarGrid
          currentMonth={currentMonth}
          currentDate={currentDate}
          bookingsByDay={bookingsByDay}
          formatBookingTime={formatBookingTime}
          onNavigateMonth={navigateMonth}
        />
      </div>
    </Layout>
  );
};

export default Calendar;


import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenant } from '@/contexts/TenantContext';

const Calendar = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  
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
  } = useCalendar(tenantId || '');

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading calendar...</div>
      </div>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          {tenantError || 'No tenant access found. Please contact support.'}
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default Calendar;

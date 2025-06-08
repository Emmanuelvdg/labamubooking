
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { DailyCalendarView } from '@/components/calendar/DailyCalendarView';
import { useCalendar } from '@/hooks/useCalendar';
import { useTenant } from '@/contexts/TenantContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { useState } from 'react';

const Calendar = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Monthly View</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Daily Staff View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <CalendarGrid
            currentMonth={currentMonth}
            currentDate={currentDate}
            bookingsByDay={bookingsByDay}
            formatBookingTime={formatBookingTime}
            onNavigateMonth={navigateMonth}
          />
        </TabsContent>

        <TabsContent value="daily">
          <DailyCalendarView
            selectedDate={selectedDate}
            staff={staff}
            bookingsByDay={bookingsByDay}
            formatBookingTime={formatBookingTime}
            onDateChange={setSelectedDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar;

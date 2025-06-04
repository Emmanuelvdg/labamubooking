
import { Layout } from '@/components/layout/Layout';
import { useBookings } from '@/hooks/useBookings';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useState } from 'react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { Booking } from '@/types';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const tenantId = '00000000-0000-0000-0000-000000000001';
  
  const { data: bookings = [] } = useBookings(tenantId);
  const { data: staff = [] } = useStaff(tenantId);
  const { data: services = [] } = useServices(tenantId);

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Filter bookings for the current month and apply additional filters
  const monthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    const isInCurrentMonth = bookingDate.getMonth() === currentDate.getMonth() && 
           bookingDate.getFullYear() === currentDate.getFullYear();
    
    if (!isInCurrentMonth) return false;
    
    // Apply staff filter
    if (selectedStaffId !== 'all' && booking.staffId !== selectedStaffId) return false;
    
    // Apply service filter
    if (selectedServiceId !== 'all' && booking.serviceId !== selectedServiceId) return false;
    
    return true;
  });

  // Group bookings by day
  const bookingsByDay = monthBookings.reduce((acc, booking) => {
    const day = new Date(booking.startTime).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(booking);
    return acc;
  }, {} as Record<number, Booking[]>);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatBookingTime = (booking: Booking) => {
    return new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const clearFilters = () => {
    setSelectedStaffId('all');
    setSelectedServiceId('all');
  };

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

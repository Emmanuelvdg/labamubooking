
import { useState } from 'react';
import { useBookings } from './useBookings';
import { useStaff } from './useStaff';
import { useServices } from './useServices';
import { Booking } from '@/types';

export const useCalendar = (tenantId: string) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  
  const { data: bookings = [] } = useBookings(tenantId);
  const { data: staff = [] } = useStaff(tenantId);
  const { data: services = [] } = useServices(tenantId);

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Filter bookings for the current month being displayed (not system current month)
  const monthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    const isInDisplayedMonth = bookingDate.getMonth() === currentDate.getMonth() && 
           bookingDate.getFullYear() === currentDate.getFullYear();
    
    if (!isInDisplayedMonth) return false;
    
    // Apply staff filter
    if (selectedStaffId !== 'all' && booking.staffId !== selectedStaffId) return false;
    
    // Apply service filter
    if (selectedServiceId !== 'all' && booking.serviceId !== selectedServiceId) return false;
    
    return true;
  });

  // Group bookings by day for the current displayed month
  const bookingsByDay = monthBookings.reduce((acc, booking) => {
    const day = new Date(booking.startTime).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(booking);
    return acc;
  }, {} as Record<number, Booking[]>);

  // Get bookings for the selected date (used by daily view)
  const selectedDateBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    const isOnSelectedDate = bookingDate.toDateString() === selectedDate.toDateString();
    
    if (!isOnSelectedDate) return false;
    
    // Apply staff filter
    if (selectedStaffId !== 'all' && booking.staffId !== selectedStaffId) return false;
    
    // Apply service filter
    if (selectedServiceId !== 'all' && booking.serviceId !== selectedServiceId) return false;
    
    return true;
  });

  // Get bookings for any specific date (utility function)
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.toDateString() === date.toDateString() &&
             (selectedStaffId === 'all' || booking.staffId === selectedStaffId) &&
             (selectedServiceId === 'all' || booking.serviceId === selectedServiceId);
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      console.log('Navigating to month:', newDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
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

  // Debug logging
  console.log('Calendar hook state:', {
    currentDate: currentDate.toISOString(),
    selectedDate: selectedDate.toISOString(),
    totalBookings: bookings.length,
    monthBookings: monthBookings.length,
    selectedDateBookings: selectedDateBookings.length,
    selectedStaffId,
    selectedServiceId
  });

  return {
    currentDate,
    selectedDate,
    currentMonth,
    selectedStaffId,
    selectedServiceId,
    staff,
    services,
    bookings,
    monthBookings,
    bookingsByDay,
    selectedDateBookings,
    navigateMonth,
    formatBookingTime,
    clearFilters,
    setCurrentDate,
    setSelectedDate,
    setSelectedStaffId,
    setSelectedServiceId,
    getBookingsForDate,
  };
};

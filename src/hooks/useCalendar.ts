
import { useState } from 'react';
import { useBookings } from './useBookings';
import { useStaff } from './useStaff';
import { useServices } from './useServices';
import { Booking } from '@/types';

export const useCalendar = (tenantId: string) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  
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

  return {
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
  };
};

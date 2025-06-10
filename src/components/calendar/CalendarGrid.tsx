
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';
import { EditBookingDialog } from '@/components/bookings/EditBookingDialog';
import { Booking } from '@/types';

interface CalendarGridProps {
  currentMonth: string;
  currentDate: Date;
  bookingsByDay: Record<number, Booking[]>;
  formatBookingTime: (booking: Booking) => string;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

export const CalendarGrid = ({ 
  currentMonth, 
  currentDate, 
  bookingsByDay, 
  formatBookingTime, 
  onNavigateMonth 
}: CalendarGridProps) => {
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [displayDate, setDisplayDate] = useState(currentDate);

  // Generate calendar grid for the display date
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const lastDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const calendarDays = [];
  const currentDateIterator = new Date(startDate);

  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const dayNumber = currentDateIterator.getMonth() === displayDate.getMonth() 
        ? currentDateIterator.getDate() 
        : null;
      
      const dayBookings = dayNumber ? bookingsByDay[dayNumber] || [] : [];
      
      calendarDays.push({
        day: dayNumber,
        bookings: dayBookings,
        date: new Date(currentDateIterator)
      });
      
      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }
  }

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    onNavigateMonth(direction);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const displayMonth = displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{displayMonth}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={() => handleNavigateMonth('prev')} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleNavigateMonth('next')} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowNewBookingDialog(true)} size="sm">
                Add Appointment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayData, index) => (
              <CalendarDay
                key={index}
                day={dayData.day}
                bookings={dayData.bookings}
                formatBookingTime={formatBookingTime}
                onBookingClick={handleBookingClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <NewBookingDialog 
        open={showNewBookingDialog}
        onOpenChange={setShowNewBookingDialog}
      />

      {selectedBooking && (
        <EditBookingDialog
          booking={selectedBooking}
          open={!!selectedBooking}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
        />
      )}
    </>
  );
};

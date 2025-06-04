
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
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
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{currentMonth}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onNavigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              bookings={day ? bookingsByDay[day] : undefined}
              formatBookingTime={formatBookingTime}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

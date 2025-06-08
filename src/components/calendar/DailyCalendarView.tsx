
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking } from '@/types';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface DailyCalendarViewProps {
  selectedDate: Date;
  staff: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  bookingsByDay: Record<number, Booking[]>;
  formatBookingTime: (booking: Booking) => string;
  onDateChange: (date: Date) => void;
}

export const DailyCalendarView = ({
  selectedDate,
  staff,
  bookingsByDay,
  formatBookingTime,
  onDateChange
}: DailyCalendarViewProps) => {
  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00',
    '1:00', '2:00', '3:00', '4:00', '5:00', '6:00'
  ];

  const previousDay = () => onDateChange(subDays(selectedDate, 1));
  const nextDay = () => onDateChange(addDays(selectedDate, 1));

  const getBookingsForStaffAtTime = (staffId: string, timeSlot: string) => {
    const dayBookings = bookingsByDay[selectedDate.getDate()] || [];
    return dayBookings.filter(booking => {
      const bookingTime = formatBookingTime(booking);
      const bookingHour = bookingTime.split(':')[0];
      const timeSlotHour = timeSlot.split(':')[0];
      return booking.staffId === staffId && bookingHour === timeSlotHour;
    });
  };

  const activeStaff = staff.filter(member => member.isActive);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Today's Schedule - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button onClick={previousDay} variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium px-4">
              {format(selectedDate, 'MMM d')}
            </span>
            <Button onClick={nextDay} variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{activeStaff.length} staff members</span>
          <span>{(bookingsByDay[selectedDate.getDate()] || []).length} appointments</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `120px repeat(${activeStaff.length}, 1fr)` }}>
              <div className="font-semibold text-gray-700 p-2 border-b">Time</div>
              {activeStaff.map((member) => (
                <div key={member.id} className="font-semibold text-gray-700 p-2 text-center border-b">
                  <div className="truncate">{member.name}</div>
                  <div className="text-xs text-gray-500 truncate">{member.role}</div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-1">
              {timeSlots.map((timeSlot) => (
                <div 
                  key={timeSlot} 
                  className="grid gap-2" 
                  style={{ gridTemplateColumns: `120px repeat(${activeStaff.length}, 1fr)` }}
                >
                  <div className="p-3 text-sm text-gray-600 border-r border-gray-200 font-medium">
                    {timeSlot}
                  </div>
                  {activeStaff.map((member) => {
                    const bookings = getBookingsForStaffAtTime(member.id, timeSlot);
                    
                    return (
                      <div key={`${member.id}-${timeSlot}`} className="min-h-[60px] p-1 border-r border-gray-100">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className={`text-xs p-2 rounded mb-1 border-l-4 ${
                              booking.status === 'confirmed' ? 'bg-blue-50 border-l-blue-500 text-blue-800' :
                              booking.status === 'pending' ? 'bg-yellow-50 border-l-yellow-500 text-yellow-800' :
                              booking.status === 'completed' ? 'bg-green-50 border-l-green-500 text-green-800' :
                              'bg-gray-50 border-l-gray-500 text-gray-800'
                            }`}
                          >
                            <div className="font-medium truncate">{booking.customer.name}</div>
                            <div className="text-xs opacity-75 truncate">{booking.service.name}</div>
                            <div className="text-xs opacity-60">{formatBookingTime(booking)}</div>
                          </div>
                        ))}
                        {bookings.length === 0 && (
                          <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                            Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

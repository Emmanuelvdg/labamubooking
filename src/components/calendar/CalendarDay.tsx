
import { Booking } from '@/types';
import { QuickActionsContextMenu } from './QuickActionsContextMenu';

interface CalendarDayProps {
  day: number | null;
  date?: Date;
  bookings?: Booking[];
  formatBookingTime: (booking: Booking) => string;
  onBookingClick?: (booking: Booking) => void;
}

export const CalendarDay = ({ day, date, bookings, formatBookingTime, onBookingClick }: CalendarDayProps) => {
  return (
    <QuickActionsContextMenu selectedDate={date}>
      <div
        className={`min-h-[100px] p-2 border rounded-lg ${
          day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
        }`}
      >
        {day && (
          <>
            <div className="font-medium text-sm mb-1">{day}</div>
            {bookings?.map(booking => (
              <div
                key={booking.id}
                className={`text-xs p-1 rounded mb-1 truncate cursor-pointer transition-colors hover:opacity-80 ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
                onClick={() => onBookingClick?.(booking)}
                title="Click to edit appointment"
              >
                <div className="font-medium">{formatBookingTime(booking)}</div>
                <div className="truncate">{booking.customer.name}</div>
                <div className="truncate text-xs opacity-75">{booking.service.name}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </QuickActionsContextMenu>
  );
};

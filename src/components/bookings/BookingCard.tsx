
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Clock, User, MoreVertical, Edit, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Booking } from '@/types';
import { EditBookingDialog } from './EditBookingDialog';
import { useEditBooking } from '@/hooks/useEditBooking';

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const editBooking = useEditBooking();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStatusChange = async (newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    await editBooking.mutateAsync({
      id: booking.id,
      status: newStatus,
      reason: `Status changed to ${newStatus}`,
    });
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={booking.customer.avatar} />
                <AvatarFallback>
                  {booking.customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{booking.customer.name}</h3>
                <p className="text-sm text-gray-600">{booking.service.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Booking
                  </DropdownMenuItem>
                  {booking.status === 'pending' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('confirmed')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </DropdownMenuItem>
                  )}
                  {booking.status === 'confirmed' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {booking.staff.name}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(booking.startTime).toLocaleDateString()}
            </div>
          </div>
          
          {booking.notes && (
            <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {booking.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <EditBookingDialog
        booking={booking}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
};


import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Filter, X } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const tenantId = '00000000-0000-0000-0000-000000000001';
  
  const { data: bookings = [] } = useBookings(tenantId);
  const { data: staff = [] } = useStaff(tenantId);
  const { data: services = [] } = useServices(tenantId);

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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

  // Filter bookings for the current month and apply additional filters
  const monthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    const isInCurrentMonth = bookingDate.getMonth() === currentDate.getMonth() && 
           bookingDate.getFullYear() === currentDate.getFullYear();
    
    if (!isInCurrentMonth) return false;
    
    // Apply staff filter
    if (selectedStaffId && booking.staffId !== selectedStaffId) return false;
    
    // Apply service filter
    if (selectedServiceId && booking.serviceId !== selectedServiceId) return false;
    
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
  }, {} as Record<number, typeof bookings>);

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

  const formatBookingTime = (booking: typeof bookings[0]) => {
    return new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const clearFilters = () => {
    setSelectedStaffId('');
    setSelectedServiceId('');
  };

  const hasActiveFilters = selectedStaffId || selectedServiceId;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">View and manage your appointment schedule</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Staff Member
                </label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All staff members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All staff members</SelectItem>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Service
                </label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mb-0">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {monthBookings.length} filtered booking{monthBookings.length !== 1 ? 's' : ''} for {currentMonth}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{currentMonth}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
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
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  }`}
                >
                  {day && (
                    <>
                      <div className="font-medium text-sm mb-1">{day}</div>
                      {bookingsByDay[day]?.map(booking => (
                        <div
                          key={booking.id}
                          className={`text-xs p-1 rounded mb-1 truncate ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium">{formatBookingTime(booking)}</div>
                          <div className="truncate">{booking.customer.name}</div>
                          <div className="truncate text-xs opacity-75">{booking.service.name}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;

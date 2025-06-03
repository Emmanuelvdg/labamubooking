
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Calendar = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Mock calendar data
  const calendarEvents = [
    { id: 1, title: 'John Doe - Haircut', time: '10:00 AM', date: 5 },
    { id: 2, title: 'Jane Smith - Color', time: '2:00 PM', date: 5 },
    { id: 3, title: 'Bob Brown - Trim', time: '9:30 AM', date: 6 },
  ];

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
    <Layout currentPath="/calendar">
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{currentMonth}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
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
                      {calendarEvents
                        .filter(event => event.date === day)
                        .map(event => (
                          <div
                            key={event.id}
                            className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1 truncate"
                          >
                            {event.time} - {event.title}
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

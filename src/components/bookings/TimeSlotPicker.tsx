
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeSlotPickerProps {
  selectedDateTime: string;
  onDateTimeSelect: (dateTime: string) => void;
}

export const TimeSlotPicker = ({ selectedDateTime, onDateTimeSelect }: TimeSlotPickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime ? new Date(selectedDateTime) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Update selectedDate when selectedDateTime prop changes, but prevent loops
  useEffect(() => {
    if (selectedDateTime) {
      const newDate = new Date(selectedDateTime);
      // Only update if the date actually changed
      if (!selectedDate || selectedDate.toDateString() !== newDate.toDateString()) {
        setSelectedDate(newDate);
      }
    }
  }, [selectedDateTime]); // Remove selectedDate from dependencies to prevent loops

  // Generate 15-minute time slots from 8:00 AM to 8:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 20 && minute > 0) break; // Stop at 8:00 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      
      // If we have a selected time, combine it with the new date
      if (selectedDateTime) {
        const currentTime = new Date(selectedDateTime);
        const newDateTime = new Date(date);
        newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
        
        // Only call onDateTimeSelect if the datetime actually changed
        const newDateTimeString = newDateTime.toISOString().slice(0, 16);
        if (newDateTimeString !== selectedDateTime) {
          onDateTimeSelect(newDateTimeString);
        }
      } else {
        // Default to 9:00 AM if no time is selected
        const newDateTime = new Date(date);
        newDateTime.setHours(9, 0, 0, 0);
        onDateTimeSelect(newDateTime.toISOString().slice(0, 16));
      }
    }
  }, [selectedDateTime, onDateTimeSelect]);

  const handleTimeSelect = useCallback((timeString: string) => {
    if (selectedDate) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      
      // Only call onDateTimeSelect if the datetime actually changed
      const newDateTimeString = newDateTime.toISOString().slice(0, 16);
      if (newDateTimeString !== selectedDateTime) {
        onDateTimeSelect(newDateTimeString);
      }
    }
  }, [selectedDate, selectedDateTime, onDateTimeSelect]);

  const getSelectedTimeString = () => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return '';
  };

  const selectedTimeString = getSelectedTimeString();

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Date</label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-11",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time (15-minute intervals)
          </label>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {timeSlots.map((timeSlot) => (
                  <Button
                    key={timeSlot}
                    variant={selectedTimeString === timeSlot ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleTimeSelect(timeSlot)}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedDateTime && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {format(new Date(selectedDateTime), "PPP 'at' p")}
          </p>
        </div>
      )}
    </div>
  );
};


import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Calendar, Users, Clock } from 'lucide-react';
import { NewBookingDialog } from '@/components/bookings/NewBookingDialog';
import { format } from 'date-fns';

interface QuickActionsContextMenuProps {
  children: React.ReactNode;
  selectedDate?: Date;
  selectedTime?: string;
  selectedStaffId?: string;
  staffName?: string;
}

export const QuickActionsContextMenu = ({ 
  children, 
  selectedDate, 
  selectedTime, 
  selectedStaffId,
  staffName 
}: QuickActionsContextMenuProps) => {
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [prefilledData, setPrefilledData] = useState<{
    date?: string;
    time?: string;
    staffId?: string;
  }>({});

  const handleAddAppointment = () => {
    const prefillData: any = {};
    
    if (selectedDate) {
      if (selectedTime) {
        // Parse time slot and create datetime
        const [hour] = selectedTime.split(':');
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(parseInt(hour), 0, 0, 0);
        prefillData.startTime = format(appointmentDate, "yyyy-MM-dd'T'HH:mm");
      } else {
        // Just use the date at 9 AM
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(9, 0, 0, 0);
        prefillData.startTime = format(appointmentDate, "yyyy-MM-dd'T'HH:mm");
      }
    }
    
    if (selectedStaffId) {
      prefillData.staffId = selectedStaffId;
    }
    
    setPrefilledData(prefillData);
    setShowNewBookingDialog(true);
  };

  const handleAddBlockedTime = () => {
    // For now, we'll use the same booking dialog but with a note
    const prefillData: any = {};
    
    if (selectedDate) {
      if (selectedTime) {
        const [hour] = selectedTime.split(':');
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(parseInt(hour), 0, 0, 0);
        prefillData.startTime = format(appointmentDate, "yyyy-MM-dd'T'HH:mm");
      } else {
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(9, 0, 0, 0);
        prefillData.startTime = format(appointmentDate, "yyyy-MM-dd'T'HH:mm");
      }
    }
    
    if (selectedStaffId) {
      prefillData.staffId = selectedStaffId;
    }
    
    prefillData.notes = 'Blocked time';
    
    setPrefilledData(prefillData);
    setShowNewBookingDialog(true);
  };

  const formatContextTitle = () => {
    if (selectedDate && selectedTime && staffName) {
      return `${format(selectedDate, 'MMM d')} at ${selectedTime} - ${staffName}`;
    } else if (selectedDate && selectedTime) {
      return `${format(selectedDate, 'MMM d')} at ${selectedTime}`;
    } else if (selectedDate) {
      return format(selectedDate, 'MMM d, yyyy');
    }
    return 'Quick Actions';
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
            {formatContextTitle()}
          </div>
          
          <ContextMenuItem onClick={handleAddAppointment} className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Add appointment</span>
          </ContextMenuItem>
          
          <ContextMenuItem onClick={handleAddAppointment} className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Add group appointment</span>
          </ContextMenuItem>
          
          <ContextMenuItem onClick={handleAddBlockedTime} className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Add blocked time</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <NewBookingDialog 
        open={showNewBookingDialog}
        onOpenChange={setShowNewBookingDialog}
        initialData={prefilledData}
      />
    </>
  );
};

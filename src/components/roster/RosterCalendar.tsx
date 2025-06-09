
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { RosterAssignment } from '@/types/roster';
import { NewRosterAssignmentDialog } from './NewRosterAssignmentDialog';

interface RosterCalendarProps {
  assignments: RosterAssignment[];
  staff: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  onAssignmentClick?: (assignment: RosterAssignment) => void;
}

export const RosterCalendar = ({ assignments, staff, onAssignmentClick }: RosterCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const getAssignmentsForDateAndStaff = (date: Date, staffId: string) => {
    return assignments.filter(assignment => {
      const assignmentDate = new Date(assignment.startTime);
      return isSameDay(assignmentDate, date) && assignment.staffId === staffId;
    });
  };

  const getStatusColor = (status: RosterAssignment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCellClick = (date: Date, staffId: string) => {
    setSelectedDate(date);
    setSelectedStaff(staffId);
    setNewAssignmentOpen(true);
  };

  const activeStaff = staff.filter(member => member.isActive);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Roster Calendar - Week of {format(weekStart, 'MMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={previousWeek} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextWeek} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setNewAssignmentOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {activeStaff.length} staff members • {assignments.length} assignments this week
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}>
                <div className="font-semibold text-gray-700 p-2">Staff</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="font-semibold text-gray-700 p-2 text-center">
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
                  </div>
                ))}
              </div>

              {/* Staff Rows */}
              <div className="space-y-1">
                {activeStaff.map((member) => (
                  <div 
                    key={member.id} 
                    className="grid gap-1" 
                    style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}
                  >
                    <div className="p-3 border-r border-gray-200">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="text-xs text-gray-500 truncate">{member.role}</div>
                    </div>
                    {weekDays.map((day) => {
                      const dayAssignments = getAssignmentsForDateAndStaff(day, member.id);
                      
                      return (
                        <div 
                          key={`${member.id}-${day.toISOString()}`} 
                          className="min-h-[80px] p-1 border-r border-gray-100 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCellClick(day, member.id)}
                        >
                          {dayAssignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className={`text-xs p-2 rounded mb-1 border cursor-pointer hover:opacity-80 ${getStatusColor(assignment.status)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignmentClick?.(assignment);
                              }}
                            >
                              <div className="font-medium">
                                {format(new Date(assignment.startTime), 'HH:mm')} - 
                                {format(new Date(assignment.endTime), 'HH:mm')}
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {assignment.assignmentType}
                              </Badge>
                            </div>
                          ))}
                          {dayAssignments.length === 0 && (
                            <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                              +
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

      <NewRosterAssignmentDialog
        open={newAssignmentOpen}
        onOpenChange={setNewAssignmentOpen}
        staff={staff}
        selectedDate={selectedDate}
        selectedStaffId={selectedStaff}
      />
    </>
  );
};

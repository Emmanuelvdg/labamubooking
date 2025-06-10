
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import { RosterCalendar } from '@/components/roster/RosterCalendar';
import { RosterTemplateManager } from '@/components/roster/RosterTemplateManager';
import { Staff } from '@/types';
import { RosterAssignment } from '@/types/roster';

interface StaffRosterTabProps {
  assignments: RosterAssignment[];
  staff: Staff[];
  onAssignmentClick: (assignment: RosterAssignment) => void;
}

export const StaffRosterTab = ({ assignments, staff, onAssignmentClick }: StaffRosterTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">Roster Management</div>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Roster Calendar
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Clock className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <RosterCalendar
            assignments={assignments}
            staff={staff}
            onAssignmentClick={onAssignmentClick}
          />
        </TabsContent>

        <TabsContent value="templates">
          <RosterTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

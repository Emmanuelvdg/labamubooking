
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Settings, CalendarDays } from 'lucide-react';
import { Staff } from '@/types';
import { RosterAssignment } from '@/types/roster';
import { StaffOverviewTab } from './StaffOverviewTab';
import { StaffSchedulesTab } from './StaffSchedulesTab';
import { StaffRosterTab } from './StaffRosterTab';
import { StaffAdvancedTab } from './StaffAdvancedTab';

interface StaffTabsContainerProps {
  staff: Staff[] | undefined;
  assignments: RosterAssignment[];
  tenantId: string;
  onAssignmentClick: (assignment: RosterAssignment) => void;
}

export const StaffTabsContainer = ({ 
  staff, 
  assignments, 
  tenantId, 
  onAssignmentClick 
}: StaffTabsContainerProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">
          <Users className="h-4 w-4 mr-2" />
          Staff Overview
        </TabsTrigger>
        <TabsTrigger value="schedules">
          <Calendar className="h-4 w-4 mr-2" />
          Schedules
        </TabsTrigger>
        <TabsTrigger value="roster">
          <CalendarDays className="h-4 w-4 mr-2" />
          Roster Management
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          Advanced
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <StaffOverviewTab staff={staff} tenantId={tenantId} />
      </TabsContent>

      <TabsContent value="schedules" className="space-y-6">
        <StaffSchedulesTab />
      </TabsContent>

      <TabsContent value="roster" className="space-y-6">
        <StaffRosterTab
          assignments={assignments}
          staff={staff || []}
          onAssignmentClick={onAssignmentClick}
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <StaffAdvancedTab />
      </TabsContent>
    </Tabs>
  );
};

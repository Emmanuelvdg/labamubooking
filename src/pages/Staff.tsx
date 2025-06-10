
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Settings, CalendarDays } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { RosterAssignment } from '@/types/roster';
import { StaffOverviewTab } from '@/components/staff/StaffOverviewTab';
import { StaffSchedulesTab } from '@/components/staff/StaffSchedulesTab';
import { StaffRosterTab } from '@/components/staff/StaffRosterTab';
import { StaffAdvancedTab } from '@/components/staff/StaffAdvancedTab';

const Staff = () => {
  const { tenantId } = useTenant();
  const { data: staff, isLoading, error } = useStaff(tenantId || '');
  const { assignments } = useRosterAssignments(tenantId || '');
  const [selectedAssignment, setSelectedAssignment] = useState<RosterAssignment | null>(null);

  const handleAssignmentClick = (assignment: RosterAssignment) => {
    setSelectedAssignment(assignment);
    // TODO: Open assignment details dialog
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading staff...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error loading staff: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage your team members, roles, schedules, and roster</p>
        </div>
      </div>

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
          <StaffOverviewTab staff={staff} tenantId={tenantId || ''} />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <StaffSchedulesTab />
        </TabsContent>

        <TabsContent value="roster" className="space-y-6">
          <StaffRosterTab
            assignments={assignments}
            staff={staff || []}
            onAssignmentClick={handleAssignmentClick}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <StaffAdvancedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;

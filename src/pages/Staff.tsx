
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Settings, Clock, CalendarDays } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { StaffActions } from '@/components/staff/StaffActions';
import { NewStaffDialog } from '@/components/staff/NewStaffDialog';
import { ManageRolesDialog } from '@/components/staff/ManageRolesDialog';
import { SyncStaffButton } from '@/components/staff/SyncStaffButton';
import { ScheduleManagementDialog } from '@/components/schedule/ScheduleManagementDialog';
import { WeeklyScheduleView } from '@/components/schedule/WeeklyScheduleView';
import { RosterCalendar } from '@/components/roster/RosterCalendar';
import { RosterTemplateManager } from '@/components/roster/RosterTemplateManager';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { RosterAssignment } from '@/types/roster';

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
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Team Members ({staff?.length || 0})</div>
            <div className="flex space-x-2">
              <SyncStaffButton tenantId={tenantId || ''} />
              <ManageRolesDialog />
              <NewStaffDialog />
            </div>
          </div>

          {staff && staff.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <StaffActions key={member.id} staff={member}>
                  <Card className="hover:shadow-md transition-shadow cursor-context-menu">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                        <Badge variant={member.isActive ? "default" : "secondary"}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Role: </span>
                          <span className="text-sm">{member.role}</span>
                        </div>
                        {member.skills && member.skills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700 block mb-1">Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </StaffActions>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first team member
                </p>
                <NewStaffDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Staff Schedules</div>
            <ScheduleManagementDialog />
          </div>
          
          <WeeklyScheduleView />
        </TabsContent>

        <TabsContent value="roster" className="space-y-6">
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
                staff={staff || []}
                onAssignmentClick={handleAssignmentClick}
              />
            </TabsContent>

            <TabsContent value="templates">
              <RosterTemplateManager />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-lg font-semibold">Advanced Settings</div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Advanced staff management features</p>
                <p className="text-sm">Permissions, bulk operations, and more coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;

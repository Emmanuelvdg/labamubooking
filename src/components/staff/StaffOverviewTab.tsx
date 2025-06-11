
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Staff } from '@/types';
import { StaffActions } from './StaffActions';
import { NewStaffDialog } from './NewStaffDialog';
import { ManageRolesDialog } from './ManageRolesDialog';
import { SyncStaffButton } from './SyncStaffButton';
import { AvatarUpload } from './AvatarUpload';

interface StaffOverviewTabProps {
  staff: Staff[] | undefined;
  tenantId: string;
}

export const StaffOverviewTab = ({ staff, tenantId }: StaffOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Team Members ({staff?.length || 0})</div>
        <div className="flex space-x-2">
          <SyncStaffButton tenantId={tenantId} />
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
                    <AvatarUpload staff={member} size="md" showUploadButton={false} />
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
    </div>
  );
};

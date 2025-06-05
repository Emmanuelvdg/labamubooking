
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Mail, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewStaffDialog } from '@/components/staff/NewStaffDialog';
import { SyncStaffButton } from '@/components/staff/SyncStaffButton';
import { StaffActions } from '@/components/staff/StaffActions';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';

const Staff = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  const { data: staff, isLoading } = useStaff(tenantId || '');

  if (tenantLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading staff...</div>
        </div>
      </Layout>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">
            {tenantError || 'No tenant access found. Please contact support.'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
            <p className="text-gray-600">Manage your team members and their skills</p>
          </div>
          <div className="flex gap-2">
            <SyncStaffButton tenantId={tenantId} />
            <NewStaffDialog />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search staff..." className="pl-10" />
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Loading staff...</p>
            </CardContent>
          </Card>
        ) : staff && staff.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <StaffActions key={member.id} staff={member}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium">{member.role}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-2" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills && member.skills.length > 0 ? (
                              member.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">No skills listed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaffActions>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>No staff members found</p>
                <p className="text-sm mt-2">Add your first staff member to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Staff;


import { useStaffPage } from '@/hooks/useStaffPage';
import { StaffPageHeader } from '@/components/staff/StaffPageHeader';
import { StaffPageLoading } from '@/components/staff/StaffPageLoading';
import { StaffPageError } from '@/components/staff/StaffPageError';
import { StaffTabsContainer } from '@/components/staff/StaffTabsContainer';

const Staff = () => {
  const {
    tenantId,
    staff,
    assignments,
    isLoading,
    error,
    handleAssignmentClick
  } = useStaffPage();

  if (isLoading) {
    return <StaffPageLoading />;
  }

  if (error) {
    return <StaffPageError error={error} />;
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader />
      <StaffTabsContainer
        staff={staff}
        assignments={assignments}
        tenantId={tenantId}
        onAssignmentClick={handleAssignmentClick}
      />
    </div>
  );
};

export default Staff;

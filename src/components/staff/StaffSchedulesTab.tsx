
import { ScheduleManagementDialog } from '@/components/schedule/ScheduleManagementDialog';
import { WeeklyScheduleView } from '@/components/schedule/WeeklyScheduleView';

export const StaffSchedulesTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Staff Schedules</div>
        <ScheduleManagementDialog />
      </div>
      
      <WeeklyScheduleView />
    </div>
  );
};

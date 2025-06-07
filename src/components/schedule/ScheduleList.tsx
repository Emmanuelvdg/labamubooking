
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Repeat } from 'lucide-react';
import { useStaffSchedules, useDeleteSchedule } from '@/hooks/useStaffSchedules';
import { useTenant } from '@/contexts/TenantContext';
import { StaffSchedule } from '@/types/schedule';
import { format } from 'date-fns';

interface ScheduleListProps {
  onEditSchedule?: (schedule: StaffSchedule) => void;
}

export const ScheduleList = ({ onEditSchedule }: ScheduleListProps) => {
  const { tenantId } = useTenant();
  const { data: schedules, isLoading } = useStaffSchedules(tenantId || '');
  const deleteSchedule = useDeleteSchedule();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      await deleteSchedule.mutateAsync(id);
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getRepeatTypeLabel = (repeatType: string) => {
    switch (repeatType) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'One-time';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading schedules...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        {schedules && schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{schedule.title}</h3>
                      {schedule.isRecurring && (
                        <Badge variant="secondary" className="text-xs">
                          <Repeat className="h-3 w-3 mr-1" />
                          {getRepeatTypeLabel(schedule.repeatType)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDateTime(schedule.startTime)} - {formatDateTime(schedule.endTime)}
                        </span>
                      </div>
                      <div>
                        Staff: {(schedule as any).staff?.name || 'Unknown'}
                      </div>
                      {schedule.description && (
                        <div className="text-gray-500">{schedule.description}</div>
                      )}
                      {schedule.isRecurring && schedule.weeklyPattern && (
                        <div className="flex items-center space-x-2">
                          <span>Days:</span>
                          <div className="flex space-x-1">
                            {schedule.weeklyPattern.map(day => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day.slice(0, 3).toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {onEditSchedule && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSchedule(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
                      disabled={deleteSchedule.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No schedules created yet</p>
            <p className="text-sm">Create your first schedule to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

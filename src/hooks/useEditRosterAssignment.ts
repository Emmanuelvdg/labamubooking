
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRosterAssignments } from '@/hooks/useRosterAssignments';
import { useTenant } from '@/contexts/TenantContext';
import { RosterAssignment } from '@/types/roster';
import { toast } from 'sonner';

interface UseEditRosterAssignmentProps {
  assignment: RosterAssignment | null;
  onSuccess?: () => void;
  onClose: () => void;
}

export const useEditRosterAssignment = ({ 
  assignment, 
  onSuccess, 
  onClose 
}: UseEditRosterAssignmentProps) => {
  const { tenantId } = useTenant();
  const { updateAssignment } = useRosterAssignments(tenantId || '');
  
  const [selectedStaff, setSelectedStaff] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'confirmed' | 'cancelled' | 'completed'>('scheduled');
  const [assignmentType, setAssignmentType] = useState<'regular' | 'template' | 'overtime' | 'emergency'>('regular');
  const [notes, setNotes] = useState('');

  const createTimestampInUserTimezone = (date: string, time: string): string => {
    const localDateTime = new Date(`${date}T${time}:00`);
    return localDateTime.toISOString();
  };

  // Reset form when assignment changes
  useEffect(() => {
    if (assignment) {
      setSelectedStaff(assignment.staffId);
      
      const startDateTime = new Date(assignment.startTime);
      const endDateTime = new Date(assignment.endTime);
      
      setStartDate(format(startDateTime, 'yyyy-MM-dd'));
      setStartTime(format(startDateTime, 'HH:mm'));
      setEndDate(format(endDateTime, 'yyyy-MM-dd'));
      setEndTime(format(endDateTime, 'HH:mm'));
      setStatus(assignment.status);
      setAssignmentType(assignment.assignmentType);
      setNotes(assignment.notes || '');
    }
  }, [assignment]);

  const handleSubmit = async () => {
    if (!assignment || !selectedStaff || !tenantId) {
      toast.error('Missing required information');
      return;
    }

    try {
      const startDateTime = createTimestampInUserTimezone(startDate, startTime);
      const endDateTime = createTimestampInUserTimezone(endDate, endTime);
      
      console.log('Updating assignment with timezone-aware data:', {
        id: assignment.id,
        startDateTime,
        endDateTime,
        localStartDate: startDate,
        localStartTime: startTime,
        localEndDate: endDate,
        localEndTime: endTime
      });
      
      await updateAssignment.mutateAsync({
        id: assignment.id,
        staffId: selectedStaff,
        startTime: startDateTime,
        endTime: endDateTime,
        status,
        assignmentType,
        notes: notes || undefined
      });

      toast.success('Roster assignment updated successfully');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update roster assignment');
    }
  };

  return {
    selectedStaff,
    setSelectedStaff,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    status,
    setStatus,
    assignmentType,
    setAssignmentType,
    notes,
    setNotes,
    handleSubmit,
    isSubmitting: updateAssignment.isPending
  };
};

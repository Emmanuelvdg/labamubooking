
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useStaff } from '@/hooks/useStaff';
import { useCreateSchedule } from '@/hooks/useCreateSchedule';
import { useTenant } from '@/contexts/TenantContext';
import { useScheduleConflictDetection } from '@/hooks/useScheduleConflictDetection';
import { ConflictDetectionPanel } from './ConflictDetectionPanel';
import { toast } from 'sonner';
import { format } from 'date-fns';

const formSchema = z.object({
  staffId: z.string().min(1, 'Please select a staff member'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
}).refine((data) => {
  const start = new Date(`${data.date}T${data.startTime}`);
  const end = new Date(`${data.date}T${data.endTime}`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type FormData = z.infer<typeof formSchema>;

interface AdHocScheduleFormProps {
  onSuccess?: () => void;
  selectedDate?: Date;
  selectedStaffId?: string;
}

export const AdHocScheduleForm = ({ onSuccess, selectedDate, selectedStaffId }: AdHocScheduleFormProps) => {
  const { tenantId } = useTenant();
  const { data: staff } = useStaff(tenantId || '');
  const { mutate: createSchedule, isPending } = useCreateSchedule();
  const { conflicts, isChecking, checkConflicts, clearConflicts } = useScheduleConflictDetection(tenantId || '');
  const [hasCheckedConflicts, setHasCheckedConflicts] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: selectedStaffId || '',
      title: '',
      description: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      startTime: '',
      endTime: '',
    },
  });

  const watchedValues = form.watch(['staffId', 'date', 'startTime', 'endTime']);

  useEffect(() => {
    if (selectedStaffId) {
      form.setValue('staffId', selectedStaffId);
    }
  }, [selectedStaffId, form]);

  useEffect(() => {
    if (selectedDate) {
      form.setValue('date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, form]);

  // Auto-check conflicts when form values change
  useEffect(() => {
    const [staffId, date, startTime, endTime] = watchedValues;
    
    if (staffId && date && startTime && endTime) {
      const startDateTime = `${date}T${startTime}:00.000Z`;
      const endDateTime = `${date}T${endTime}:00.000Z`;
      
      const timeoutId = setTimeout(() => {
        console.log('Auto-checking conflicts for:', { staffId, startDateTime, endDateTime });
        checkConflicts(staffId, startDateTime, endDateTime);
        setHasCheckedConflicts(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      clearConflicts();
      setHasCheckedConflicts(false);
    }
  }, [watchedValues, checkConflicts, clearConflicts]);

  const onSubmit = async (data: FormData) => {
    console.log('Submitting ad-hoc schedule:', data);
    
    if (!tenantId) {
      toast.error('No tenant selected');
      return;
    }

    // Check for blocking conflicts before submission
    const errorConflicts = conflicts.filter(c => c.severity === 'error');
    if (errorConflicts.length > 0) {
      toast.error('Cannot create schedule with conflicts. Please resolve them first.');
      return;
    }

    const startDateTime = `${data.date}T${data.startTime}:00.000Z`;
    const endDateTime = `${data.date}T${data.endTime}:00.000Z`;

    createSchedule({
      tenantId,
      staffId: data.staffId,
      title: data.title,
      description: data.description,
      startTime: startDateTime,
      endTime: endDateTime,
      isRecurring: false,
      repeatType: 'none',
    }, {
      onSuccess: () => {
        console.log('Ad-hoc schedule created successfully');
        toast.success('Schedule created successfully');
        form.reset();
        clearConflicts();
        setHasCheckedConflicts(false);
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error creating schedule:', error);
        toast.error('Failed to create schedule');
      }
    });
  };

  const canSubmit = hasCheckedConflicts && conflicts.filter(c => c.severity === 'error').length === 0;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Member</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staff?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter schedule title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {(hasCheckedConflicts || isChecking) && (
            <ConflictDetectionPanel conflicts={conflicts} isChecking={isChecking} />
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={isPending || isChecking || !canSubmit}
            >
              {isPending ? 'Creating...' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

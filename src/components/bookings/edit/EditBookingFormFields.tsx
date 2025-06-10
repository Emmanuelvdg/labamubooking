
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  status: string;
  notes: string;
  reason: string;
}

interface EditBookingFormFieldsProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  customers: any[];
  staff: any[];
  services: any[];
  isCheckingConflicts: boolean;
  conflicts: any[];
  editBooking: any;
  onTimeChange: (time: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditBookingFormFields = ({
  formData,
  updateFormData,
  customers,
  staff,
  services,
  isCheckingConflicts,
  conflicts,
  editBooking,
  onTimeChange,
  onSubmit,
}: EditBookingFormFieldsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Select 
            value={formData.customerId} 
            onValueChange={(value) => updateFormData({ customerId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="staff">Staff Member</Label>
          <Select 
            value={formData.staffId} 
            onValueChange={(value) => updateFormData({ staffId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {staff?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Select 
            value={formData.serviceId} 
            onValueChange={(value) => updateFormData({ serviceId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - ${service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: any) => updateFormData({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="startTime">Date & Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => onTimeChange(e.target.value)}
            required
          />
          {isCheckingConflicts && (
            <p className="text-sm text-gray-500">Checking for conflicts...</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes for this booking..."
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Change</Label>
        <Input
          id="reason"
          placeholder="Why are you making this change?"
          value={formData.reason}
          onChange={(e) => updateFormData({ reason: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <Button 
          type="submit" 
          disabled={editBooking.isPending || (conflicts.some((c: any) => c.severity === 'error'))}
        >
          {editBooking.isPending ? 'Updating...' : 'Update Booking'}
        </Button>
      </div>
    </form>
  );
};

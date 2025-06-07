
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, History } from 'lucide-react';
import { useEditBooking } from '@/hooks/useEditBooking';
import { useCheckBookingConflicts, useBookingEdits } from '@/hooks/useBookingEdits';
import { useCustomers } from '@/hooks/useCustomers';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useTenant } from '@/contexts/TenantContext';
import { Booking } from '@/types';

interface EditBookingFormProps {
  booking: Booking;
  onSuccess?: () => void;
}

export const EditBookingForm = ({ booking, onSuccess }: EditBookingFormProps) => {
  const [formData, setFormData] = useState({
    customerId: booking.customerId,
    staffId: booking.staffId,
    serviceId: booking.serviceId,
    startTime: new Date(booking.startTime).toISOString().slice(0, 16),
    status: booking.status,
    notes: booking.notes || '',
    reason: ''
  });
  
  const [conflicts, setConflicts] = useState<any[]>([]);

  const { tenantId } = useTenant();
  const { data: customers } = useCustomers(tenantId || '');
  const { data: staff } = useStaff(tenantId || '');
  const { data: services } = useServices(tenantId || '');
  const { data: bookingEdits } = useBookingEdits(booking.id);
  
  const editBooking = useEditBooking();
  const checkConflicts = useCheckBookingConflicts();

  const handleTimeChange = async (newStartTime: string) => {
    setFormData(prev => ({ ...prev, startTime: newStartTime }));
    
    const selectedService = services?.find(s => s.id === formData.serviceId);
    if (!selectedService || !tenantId) return;

    const startTime = new Date(newStartTime);
    const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

    const conflictResults = await checkConflicts.mutateAsync({
      bookingId: booking.id,
      staffId: formData.staffId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      tenantId,
    });
    
    setConflicts(conflictResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) return;

    const selectedService = services?.find(s => s.id === formData.serviceId);
    if (!selectedService) return;

    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

    await editBooking.mutateAsync({
      id: booking.id,
      customerId: formData.customerId,
      staffId: formData.staffId,
      serviceId: formData.serviceId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: formData.status,
      notes: formData.notes,
      reason: formData.reason,
    });

    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Booking Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conflicts.map((conflict, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-yellow-700">
                  {conflict.conflict_type.replace('_', ' ').toUpperCase()}
                </span>
                <Badge variant={conflict.severity === 'error' ? 'destructive' : 'secondary'}>
                  {conflict.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
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
            <Select value={formData.staffId} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: value }))}>
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
            <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
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
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
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
              onChange={(e) => handleTimeChange(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes for this booking..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Change</Label>
          <Input
            id="reason"
            placeholder="Why are you making this change?"
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          />
        </div>

        <div className="flex justify-between">
          <Button 
            type="submit" 
            disabled={editBooking.isPending || (conflicts.some(c => c.severity === 'error'))}
          >
            {editBooking.isPending ? 'Updating...' : 'Update Booking'}
          </Button>
        </div>
      </form>

      {/* Edit History */}
      {bookingEdits && bookingEdits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Edit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookingEdits.map((edit) => (
                <div key={edit.id} className="border-l-2 border-gray-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{edit.editType.replace('_', ' ')}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(edit.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {edit.reason && (
                    <p className="text-sm text-gray-600">{edit.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

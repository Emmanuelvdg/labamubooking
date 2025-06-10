
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SimpleCustomerSelection } from './SimpleCustomerSelection';
import { SimpleServiceSelection } from './SimpleServiceSelection';
import { SimpleStaffSelection } from './SimpleStaffSelection';
import { Plus } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useTenantContext } from '@/hooks/useTenantContext';

interface AddToWaitlistDialogProps {
  onAddToWaitlist: (entry: any) => void;
  isLoading?: boolean;
}

export const AddToWaitlistDialog = ({ onAddToWaitlist, isLoading }: AddToWaitlistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [preferredStaffId, setPreferredStaffId] = useState('');
  const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState('');
  const [notes, setNotes] = useState('');

  const { currentTenantId } = useTenantContext();
  const { data: customers } = useCustomers(currentTenantId);
  const { data: services } = useServices(currentTenantId);
  const { data: staff } = useStaff(currentTenantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || !serviceId) {
      return;
    }

    onAddToWaitlist({
      customer_id: customerId,
      service_id: serviceId,
      preferred_staff_id: preferredStaffId || undefined,
      estimated_wait_minutes: estimatedWaitMinutes ? parseInt(estimatedWaitMinutes) : undefined,
      notes: notes || undefined,
      status: 'waiting'
    });

    // Reset form
    setCustomerId('');
    setServiceId('');
    setPreferredStaffId('');
    setEstimatedWaitMinutes('');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add to Waitlist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Customer to Waitlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SimpleCustomerSelection
            selectedCustomerId={customerId}
            onCustomerSelect={setCustomerId}
            customers={customers}
          />

          <SimpleServiceSelection
            selectedServiceId={serviceId}
            onServiceSelect={setServiceId}
            services={services}
          />

          <SimpleStaffSelection
            selectedStaffId={preferredStaffId}
            onStaffSelect={setPreferredStaffId}
            staff={staff}
          />

          <div className="space-y-2">
            <Label htmlFor="estimatedWait">Estimated Wait (minutes)</Label>
            <Input
              id="estimatedWait"
              type="number"
              value={estimatedWaitMinutes}
              onChange={(e) => setEstimatedWaitMinutes(e.target.value)}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!customerId || !serviceId || isLoading}
            >
              {isLoading ? 'Adding...' : 'Add to Waitlist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

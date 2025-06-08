
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Service } from '@/types';
import { useUpdateService } from '@/hooks/useServices';
import { ServiceForm } from './ServiceForm';

interface EditServiceDialogProps {
  service: Service;
}

export const EditServiceDialog = ({ service }: EditServiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const updateService = useUpdateService();

  const handleSubmit = async (formData: Omit<Service, 'id'>) => {
    try {
      await updateService.mutateAsync({
        ...formData,
        id: service.id,
      });
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          initialData={service}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={updateService.isPending}
          submitButtonText="Update Service"
        />
      </DialogContent>
    </Dialog>
  );
};

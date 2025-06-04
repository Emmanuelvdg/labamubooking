
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CommissionSchemeForm } from './CommissionSchemeForm';

interface NewCommissionSchemeDialogProps {
  tenantId: string;
}

export const NewCommissionSchemeDialog = ({ tenantId }: NewCommissionSchemeDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Commission Scheme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Commission Scheme</DialogTitle>
        </DialogHeader>
        <CommissionSchemeForm 
          tenantId={tenantId} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

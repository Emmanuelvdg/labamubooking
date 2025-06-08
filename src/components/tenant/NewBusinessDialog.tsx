
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTenant } from '@/hooks/useCreateTenant';
import { useTenant } from '@/contexts/TenantContext';
import BusinessDetailsFields from './BusinessDetailsFields';

interface NewBusinessDialogProps {
  trigger?: React.ReactNode;
}

const NewBusinessDialog = ({ trigger }: NewBusinessDialogProps) => {
  const { toast } = useToast();
  const createTenant = useCreateTenant();
  const { refetchTenant } = useTenant();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (createTenant.isPending) return;
    
    if (!formData.businessName || !formData.businessType) {
      toast({
        title: "Missing Information",
        description: "Please fill in business name and type",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating new business for existing user');
      
      // For existing users, we don't need email/password as they're already authenticated
      // We'll use empty values that won't be used in the backend
      const result = await createTenant.mutateAsync({
        businessName: formData.businessName,
        businessType: formData.businessType,
        description: formData.description,
        ownerName: '', // Will be ignored for existing users
        email: '', // Will be ignored for existing users
        phone: '',
        password: '', // Will be ignored for existing users
      });
      
      console.log('New business created successfully:', result);
      
      // Refresh tenant context to include the new business
      await refetchTenant();
      
      // Close dialog and reset form
      setOpen(false);
      setFormData({
        businessName: '',
        businessType: '',
        description: '',
      });
      
      toast({
        title: "Business Created Successfully!",
        description: `${formData.businessName} has been added to your account.`,
      });
      
    } catch (error) {
      console.error('Error creating new business:', error);
      // Error handling is done in the mutation's onError callback
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center space-x-2">
      <Plus className="h-4 w-4" />
      <span>Add Business</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Business</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <BusinessDetailsFields 
            formData={formData}
            onInputChange={handleInputChange}
            disabled={createTenant.isPending}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createTenant.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createTenant.isPending}
            >
              {createTenant.isPending ? "Creating..." : "Create Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBusinessDialog;

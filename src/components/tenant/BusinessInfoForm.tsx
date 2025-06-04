
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTenant } from '@/hooks/useTenants';
import BusinessDetailsFields from './BusinessDetailsFields';
import ContactInfoFields from './ContactInfoFields';

const BusinessInfoForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTenant = useCreateTenant();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    ownerName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (createTenant.isPending) return;
    
    // Validate required fields
    if (!formData.businessName || !formData.businessType || !formData.ownerName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting tenant creation form:', formData);
      
      const tenant = await createTenant.mutateAsync({
        businessName: formData.businessName,
        businessType: formData.businessType,
        description: formData.description,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
      });
      
      console.log('Tenant created, navigating to dashboard:', tenant);
      
      toast({
        title: "Business Created Successfully!",
        description: "Welcome to BookingPro. Let's set up your dashboard.",
      });
      
      // Navigate to dashboard after successful creation
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error handling is done in the mutation's onError callback
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Your Business</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BusinessDetailsFields 
            formData={formData}
            onInputChange={handleInputChange}
            disabled={createTenant.isPending}
          />

          <ContactInfoFields 
            formData={formData}
            onInputChange={handleInputChange}
            disabled={createTenant.isPending}
          />

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            disabled={createTenant.isPending}
          >
            {createTenant.isPending ? (
              "Creating Business..."
            ) : (
              <>
                Create Business & Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoForm;

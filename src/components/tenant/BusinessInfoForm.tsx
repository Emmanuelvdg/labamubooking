
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTenant } from '@/hooks/useTenants';
import { isValidEmail, getEmailValidationError } from '@/utils/emailValidation';
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
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (createTenant.isPending) return;
    
    // Validate required fields
    if (!formData.businessName || !formData.businessType || !formData.ownerName || !formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailError = getEmailValidationError(formData.email);
    if (emailError) {
      toast({
        title: "Invalid Email",
        description: emailError,
        variant: "destructive",
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting tenant creation form with account setup');
      
      const result = await createTenant.mutateAsync({
        businessName: formData.businessName,
        businessType: formData.businessType,
        description: formData.description,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      console.log('Business and account created successfully:', result);
      
      // Check if user needs email confirmation
      if (result.user && !result.user.email_confirmed_at && !result.isExistingUser) {
        toast({
          title: "Almost Done!",
          description: "We've sent you a confirmation email. Please click the link in the email to complete your account setup and log in.",
        });
        
        // Don't navigate to dashboard, stay on current page or go to a confirmation page
        return;
      }
      
      // Add a small delay to ensure tenant context has been refreshed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If no email confirmation needed (auto-confirmed) or existing user, proceed to dashboard
      if (result.session) {
        toast({
          title: "Business Created Successfully!",
          description: result.isExistingUser 
            ? "Welcome back! Your new business is ready. You are now logged in and can access your dashboard."
            : "Welcome to BookingPro. You are now logged in and ready to use your dashboard.",
        });
        navigate('/dashboard');
      } else {
        // Fallback - redirect to auth page for manual login
        toast({
          title: "Business Created Successfully!",
          description: "Your business has been created. Please log in with your credentials.",
        });
        navigate('/auth');
      }
      
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
        <CardTitle className="text-2xl text-center">Create Your Business Account</CardTitle>
        <p className="text-center text-gray-600">Set up your business and create your account</p>
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
              "Creating Business & Account..."
            ) : (
              <>
                Create Business & Account
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

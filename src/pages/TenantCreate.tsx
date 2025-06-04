
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTenant } from '@/hooks/useTenants';

const TenantCreate = () => {
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

  const businessTypes = [
    'Hair Salon',
    'Spa & Wellness',
    'Massage Therapy',
    'Nail Salon',
    'Beauty Clinic',
    'Barbershop',
    'Fitness Studio',
    'Dental Practice',
    'Medical Clinic',
    'Consultation Services',
    'Other'
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to BookingPro</h1>
          <p className="text-xl text-gray-600">Set up your service business in minutes</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Your Business</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Bella Vista Spa"
                    required
                    disabled={createTenant.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select 
                    onValueChange={(value) => handleInputChange('businessType', value)}
                    disabled={createTenant.isPending}
                    value={formData.businessType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your services and what makes your business special..."
                  rows={3}
                  disabled={createTenant.isPending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="John Smith"
                    required
                    disabled={createTenant.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@bellavistaspa.com"
                    required
                    disabled={createTenant.isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={createTenant.isPending}
                />
              </div>

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

        <div className="text-center mt-6 text-gray-600">
          <p>Already have a business? <a href="/login" className="text-blue-600 hover:underline">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
};

export default TenantCreate;


import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BusinessDetailsFieldsProps {
  formData: {
    businessName: string;
    businessType: string;
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
  disabled: boolean;
}

const BusinessDetailsFields = ({ formData, onInputChange, disabled }: BusinessDetailsFieldsProps) => {
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => onInputChange('businessName', e.target.value)}
            placeholder="Bella Vista Spa"
            required
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select 
            onValueChange={(value) => onInputChange('businessType', value)}
            disabled={disabled}
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
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe your services and what makes your business special..."
          rows={3}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default BusinessDetailsFields;

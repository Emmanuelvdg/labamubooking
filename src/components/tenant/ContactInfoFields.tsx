
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoFieldsProps {
  formData: {
    ownerName: string;
    email: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
  disabled: boolean;
}

const ContactInfoFields = ({ formData, onInputChange, disabled }: ContactInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => onInputChange('ownerName', e.target.value)}
            placeholder="John Smith"
            required
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="john@bellavistaspa.com"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default ContactInfoFields;

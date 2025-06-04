
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoFieldsProps {
  formData: {
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="Enter your password"
            required
            disabled={disabled}
            minLength={6}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={disabled}
            minLength={6}
          />
        </div>
      </div>
    </>
  );
};

export default ContactInfoFields;

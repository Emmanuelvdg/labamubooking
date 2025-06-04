
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useCreateCommissionScheme } from '@/hooks/useCommissionSchemes';
import { CommissionScheme } from '@/types/commission';

interface CommissionSchemeFormProps {
  tenantId: string;
  onSuccess?: () => void;
}

interface FormData {
  staffId: string;
  serviceId: string;
  commissionType: 'percentage' | 'nominal';
  commissionValue: number;
}

export const CommissionSchemeForm = ({ tenantId, onSuccess }: CommissionSchemeFormProps) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      commissionType: 'percentage'
    }
  });
  const { data: staff } = useStaff(tenantId);
  const { data: services } = useServices(tenantId);
  const createScheme = useCreateCommissionScheme();
  
  const commissionType = watch('commissionType', 'percentage');

  // Register the commissionType field
  register('commissionType', { required: 'Commission type is required' });

  const onSubmit = (data: FormData) => {
    console.log('Submitting form data:', data);
    
    const schemeData: Omit<CommissionScheme, 'id' | 'createdAt' | 'updatedAt' | 'staff' | 'service'> = {
      tenantId,
      staffId: data.staffId,
      serviceId: data.serviceId === 'all' ? undefined : data.serviceId,
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      isActive: true,
    };

    console.log('Creating scheme with data:', schemeData);

    createScheme.mutate(schemeData, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="staffId">Staff Member</Label>
        <Select onValueChange={(value) => setValue('staffId', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {staff?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.staffId && <p className="text-sm text-red-600">Staff member is required</p>}
      </div>

      <div>
        <Label htmlFor="serviceId">Service</Label>
        <Select onValueChange={(value) => setValue('serviceId', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select service (or all services)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services?.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceId && <p className="text-sm text-red-600">Service selection is required</p>}
      </div>

      <div>
        <Label>Commission Type</Label>
        <RadioGroup 
          value={commissionType} 
          onValueChange={(value) => setValue('commissionType', value as 'percentage' | 'nominal')}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage">Percentage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nominal" id="nominal" />
            <Label htmlFor="nominal">Fixed Amount</Label>
          </div>
        </RadioGroup>
        {errors.commissionType && <p className="text-sm text-red-600">{errors.commissionType.message}</p>}
      </div>

      <div>
        <Label htmlFor="commissionValue">
          Commission {commissionType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
        </Label>
        <Input
          id="commissionValue"
          type="number"
          step={commissionType === 'percentage' ? '0.1' : '0.01'}
          min="0"
          max={commissionType === 'percentage' ? '100' : undefined}
          {...register('commissionValue', { 
            required: 'Commission value is required',
            min: { value: 0, message: 'Commission value must be positive' },
            max: commissionType === 'percentage' ? { value: 100, message: 'Percentage cannot exceed 100%' } : undefined,
            valueAsNumber: true
          })}
        />
        {errors.commissionValue && <p className="text-sm text-red-600">{errors.commissionValue.message}</p>}
      </div>

      <Button type="submit" disabled={createScheme.isPending} className="w-full">
        {createScheme.isPending ? 'Creating...' : 'Create Commission Scheme'}
      </Button>
    </form>
  );
};

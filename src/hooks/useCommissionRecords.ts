
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommissionRecord } from '@/types/commission';
import { toast } from '@/hooks/use-toast';

export const useCommissionRecords = (tenantId: string) => {
  return useQuery({
    queryKey: ['commission-records', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_records')
        .select(`
          *,
          staff:staff!staff_id(id, name),
          service:services!service_id(id, name)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        tenantId: record.tenant_id,
        bookingId: record.booking_id,
        staffId: record.staff_id,
        serviceId: record.service_id,
        commissionSchemeId: record.commission_scheme_id,
        servicePrice: record.service_price,
        commissionType: record.commission_type as 'percentage' | 'nominal',
        commissionValue: record.commission_value,
        commissionAmount: record.commission_amount,
        isPaid: record.is_paid,
        paidAt: record.paid_at,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        staff: record.staff,
        service: record.service,
      })) as CommissionRecord[];
    },
    enabled: !!tenantId,
  });
};

export const useMarkCommissionPaid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recordId: string) => {
      const { data, error } = await supabase
        .from('commission_records')
        .update({ 
          is_paid: true, 
          paid_at: new Date().toISOString() 
        })
        .eq('id', recordId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-records'] });
      toast({
        title: 'Success',
        description: 'Commission marked as paid',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark commission as paid',
        variant: 'destructive',
      });
      console.error('Error marking commission as paid:', error);
    },
  });
};

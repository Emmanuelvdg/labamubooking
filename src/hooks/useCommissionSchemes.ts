
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommissionScheme } from '@/types/commission';
import { toast } from '@/hooks/use-toast';

export const useCommissionSchemes = (tenantId: string) => {
  return useQuery({
    queryKey: ['commission-schemes', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_schemes')
        .select(`
          *,
          staff:staff!staff_id(id, name),
          service:services!service_id(id, name)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(scheme => ({
        id: scheme.id,
        tenantId: scheme.tenant_id,
        staffId: scheme.staff_id,
        serviceId: scheme.service_id,
        commissionType: scheme.commission_type as 'percentage' | 'nominal',
        commissionValue: scheme.commission_value,
        isActive: scheme.is_active,
        createdAt: scheme.created_at,
        updatedAt: scheme.updated_at,
        staff: scheme.staff,
        service: scheme.service,
      })) as CommissionScheme[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateCommissionScheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scheme: Omit<CommissionScheme, 'id' | 'createdAt' | 'updatedAt' | 'staff' | 'service'>) => {
      const dbScheme = {
        tenant_id: scheme.tenantId,
        staff_id: scheme.staffId,
        service_id: scheme.serviceId || null,
        commission_type: scheme.commissionType,
        commission_value: scheme.commissionValue,
        is_active: scheme.isActive,
      };

      const { data, error } = await supabase
        .from('commission_schemes')
        .insert([dbScheme])
        .select(`
          *,
          staff:staff!staff_id(id, name),
          service:services!service_id(id, name)
        `)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        tenantId: data.tenant_id,
        staffId: data.staff_id,
        serviceId: data.service_id,
        commissionType: data.commission_type as 'percentage' | 'nominal',
        commissionValue: data.commission_value,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        staff: data.staff,
        service: data.service,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-schemes'] });
      toast({
        title: 'Success',
        description: 'Commission scheme created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create commission scheme',
        variant: 'destructive',
      });
      console.error('Error creating commission scheme:', error);
    },
  });
};

export const useUpdateCommissionScheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CommissionScheme> }) => {
      const dbUpdates: any = {};
      if (updates.commissionType) dbUpdates.commission_type = updates.commissionType;
      if (updates.commissionValue !== undefined) dbUpdates.commission_value = updates.commissionValue;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.serviceId !== undefined) dbUpdates.service_id = updates.serviceId || null;

      const { data, error } = await supabase
        .from('commission_schemes')
        .update(dbUpdates)
        .eq('id', id)
        .select(`
          *,
          staff:staff!staff_id(id, name),
          service:services!service_id(id, name)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-schemes'] });
      toast({
        title: 'Success',
        description: 'Commission scheme updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update commission scheme',
        variant: 'destructive',
      });
      console.error('Error updating commission scheme:', error);
    },
  });
};

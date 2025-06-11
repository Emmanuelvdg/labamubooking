
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AddonIntegration } from '@/types/addons';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export const useAddonIntegrations = () => {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  const {
    data: integrations = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['addon-integrations', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];

      const { data, error } = await supabase
        .from('addon_integrations')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('integration_type');

      if (error) throw error;
      return data as AddonIntegration[];
    },
    enabled: !!tenantId
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async (params: {
      integration_type: AddonIntegration['integration_type'];
      updates: Partial<AddonIntegration>;
    }) => {
      if (!tenantId) throw new Error('No tenant selected');

      const { data, error } = await supabase
        .from('addon_integrations')
        .upsert({
          tenant_id: tenantId,
          integration_type: params.integration_type,
          ...params.updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as AddonIntegration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addon-integrations'] });
      toast.success('Integration updated successfully');
    },
    onError: (error) => {
      console.error('Error updating integration:', error);
      toast.error('Failed to update integration');
    }
  });

  return {
    integrations,
    isLoading,
    error,
    updateIntegration: updateIntegrationMutation.mutate,
    isUpdating: updateIntegrationMutation.isPending
  };
};

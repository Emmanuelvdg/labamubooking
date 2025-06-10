
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

interface ReminderConfiguration {
  id?: string;
  tenant_id: string;
  reminder_type: string;
  enabled: boolean;
  channel: string;
  timing_hours?: number;
  message_template?: string;
  created_at?: string;
  updated_at?: string;
}

interface AutomatedMessageType {
  id: string;
  name: string;
  description: string;
  category: string;
  default_timing_hours: number;
  default_template: string;
  is_active: boolean;
}

export const useReminderConfigurations = () => {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  const {
    data: configurations = [],
    isLoading: configurationsLoading,
    error: configurationsError,
  } = useQuery({
    queryKey: ['reminder-configurations', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID');

      const { data, error } = await supabase
        .from('reminder_configurations')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('reminder_type');

      if (error) throw error;
      return data as ReminderConfiguration[];
    },
    enabled: !!tenantId,
  });

  const {
    data: messageTypes = [],
    isLoading: messageTypesLoading,
    error: messageTypesError,
  } = useQuery({
    queryKey: ['automated-message-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automated_message_types')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data as AutomatedMessageType[];
    },
  });

  const upsertConfigurationMutation = useMutation({
    mutationFn: async (config: ReminderConfiguration) => {
      const { data, error } = await supabase
        .from('reminder_configurations')
        .upsert({
          ...config,
          tenant_id: tenantId!,
        }, {
          onConflict: 'tenant_id,reminder_type,channel'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder-configurations', tenantId] });
      toast.success('Reminder configuration updated');
    },
    onError: (error) => {
      console.error('Error updating reminder configuration:', error);
      toast.error('Failed to update reminder configuration');
    },
  });

  const deleteConfigurationMutation = useMutation({
    mutationFn: async (configId: string) => {
      const { error } = await supabase
        .from('reminder_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder-configurations', tenantId] });
      toast.success('Reminder configuration deleted');
    },
    onError: (error) => {
      console.error('Error deleting reminder configuration:', error);
      toast.error('Failed to delete reminder configuration');
    },
  });

  return {
    configurations,
    messageTypes,
    isLoading: configurationsLoading || messageTypesLoading,
    error: configurationsError || messageTypesError,
    upsertConfiguration: upsertConfigurationMutation.mutate,
    deleteConfiguration: deleteConfigurationMutation.mutate,
    isUpserting: upsertConfigurationMutation.isPending,
    isDeleting: deleteConfigurationMutation.isPending,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistEntry } from '@/types/waitlist';
import { useTenantContext } from './useTenantContext';
import { toast } from 'sonner';

export const useWaitlist = () => {
  const { currentTenant } = useTenantContext();
  const queryClient = useQueryClient();

  const {
    data: waitlistEntries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['waitlist', currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .eq('tenant_id', currentTenant.id)
        .order('queue_position', { ascending: true });

      if (error) throw error;
      return data as WaitlistEntry[];
    },
    enabled: !!currentTenant?.id
  });

  const addToWaitlistMutation = useMutation({
    mutationFn: async (entry: Omit<WaitlistEntry, 'id' | 'queue_position' | 'created_at' | 'updated_at' | 'tenant_id'>) => {
      if (!currentTenant?.id) throw new Error('No tenant selected');

      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert({
          ...entry,
          tenant_id: currentTenant.id
        })
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .single();

      if (error) throw error;
      return data as WaitlistEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Customer added to waitlist');
    },
    onError: (error) => {
      console.error('Error adding to waitlist:', error);
      toast.error('Failed to add customer to waitlist');
    }
  });

  const updateWaitlistEntryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WaitlistEntry> }) => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .single();

      if (error) throw error;
      return data as WaitlistEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Waitlist entry updated');
    },
    onError: (error) => {
      console.error('Error updating waitlist entry:', error);
      toast.error('Failed to update waitlist entry');
    }
  });

  const callNextMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .update({
          status: 'called',
          called_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId)
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .single();

      if (error) throw error;
      return data as WaitlistEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Customer called');
    },
    onError: (error) => {
      console.error('Error calling customer:', error);
      toast.error('Failed to call customer');
    }
  });

  const markAsServedMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .update({
          status: 'served',
          served_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId)
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .single();

      if (error) throw error;
      return data as WaitlistEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Customer marked as served');
    },
    onError: (error) => {
      console.error('Error marking as served:', error);
      toast.error('Failed to mark customer as served');
    }
  });

  return {
    waitlistEntries,
    isLoading,
    error,
    addToWaitlist: addToWaitlistMutation.mutate,
    updateWaitlistEntry: updateWaitlistEntryMutation.mutate,
    callNext: callNextMutation.mutate,
    markAsServed: markAsServedMutation.mutate,
    isAddingToWaitlist: addToWaitlistMutation.isPending,
    isUpdating: updateWaitlistEntryMutation.isPending
  };
};

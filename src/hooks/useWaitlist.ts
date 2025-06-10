import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistEntry, WaitlistEntryInsert } from '@/types/waitlist';
import { useTenantContext } from './useTenantContext';
import { toast } from 'sonner';

export const useWaitlist = () => {
  const { currentTenantId } = useTenantContext();
  const queryClient = useQueryClient();

  const {
    data: waitlistEntries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['waitlist', currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];

      const { data, error } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .eq('tenant_id', currentTenantId)
        .order('queue_position', { ascending: true });

      if (error) throw error;
      return data as unknown as WaitlistEntry[];
    },
    enabled: !!currentTenantId
  });

  const addToWaitlistMutation = useMutation({
    mutationFn: async (entry: {
      customer_id: string;
      service_id: string;
      preferred_staff_id?: string;
      estimated_wait_minutes?: number;
      notes?: string;
      status: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
    }) => {
      if (!currentTenantId) throw new Error('No tenant selected');

      const insertData: WaitlistEntryInsert = {
        customer_id: entry.customer_id,
        service_id: entry.service_id,
        preferred_staff_id: entry.preferred_staff_id,
        estimated_wait_minutes: entry.estimated_wait_minutes,
        notes: entry.notes,
        status: entry.status,
        tenant_id: currentTenantId
        // queue_position is intentionally omitted - will be set by database trigger
      };

      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert(insertData)
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .single();

      if (error) throw error;
      return data as unknown as WaitlistEntry;
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
      return data as unknown as WaitlistEntry;
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
      return data as unknown as WaitlistEntry;
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
      return data as unknown as WaitlistEntry;
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
    updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => 
      updateWaitlistEntryMutation.mutate({ id, updates }),
    callNext: callNextMutation.mutate,
    markAsServed: markAsServedMutation.mutate,
    isAddingToWaitlist: addToWaitlistMutation.isPending,
    isUpdating: updateWaitlistEntryMutation.isPending
  };
};

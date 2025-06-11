import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistEntry, WaitlistEntryInsert } from '@/types/waitlist';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export const useWaitlist = () => {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  console.log('useWaitlist - tenantId:', tenantId);

  const {
    data: waitlistEntries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['waitlist', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        console.log('useWaitlist - No tenantId, returning empty array');
        return [];
      }

      console.log('useWaitlist - Fetching waitlist entries for tenant:', tenantId);

      const { data, error } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          customer:customers(id, name, email, phone),
          service:services(id, name, duration, price),
          preferred_staff:staff(id, name)
        `)
        .eq('tenant_id', tenantId)
        .order('queue_position', { ascending: true });

      if (error) {
        console.error('useWaitlist - Error fetching waitlist entries:', error);
        throw error;
      }
      
      console.log('useWaitlist - Fetched waitlist entries:', data);
      return data as unknown as WaitlistEntry[];
    },
    enabled: !!tenantId
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
      if (!tenantId) throw new Error('No tenant selected');

      console.log('useWaitlist - Adding to waitlist with tenantId:', tenantId, 'entry:', entry);

      const insertData: WaitlistEntryInsert = {
        customer_id: entry.customer_id,
        service_id: entry.service_id,
        preferred_staff_id: entry.preferred_staff_id,
        estimated_wait_minutes: entry.estimated_wait_minutes,
        notes: entry.notes,
        status: entry.status,
        tenant_id: tenantId
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

      if (error) {
        console.error('useWaitlist - Error adding to waitlist:', error);
        throw error;
      }
      
      console.log('useWaitlist - Successfully added to waitlist:', data);
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

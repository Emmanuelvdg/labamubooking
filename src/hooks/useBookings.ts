
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useBookings = (tenantId: string) => {
  return useQuery({
    queryKey: ['bookings', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'customer' | 'staff' | 'service'>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          service:services(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Success',
        description: 'Booking created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
      console.error('Error creating booking:', error);
    },
  });
};

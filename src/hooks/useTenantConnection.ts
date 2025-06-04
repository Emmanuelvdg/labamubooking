
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ConnectUserToTenantData {
  userId: string;
  tenantId: string;
  role?: string;
}

export const useConnectUserToTenant = () => {
  return useMutation({
    mutationFn: async ({ userId, tenantId, role = 'user' }: ConnectUserToTenantData) => {
      console.log('Connecting user to tenant:', { userId, tenantId, role });
      
      const { data, error } = await supabase
        .from('user_tenants')
        .insert([{
          user_id: userId,
          tenant_id: tenantId,
          role: role,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error connecting user to tenant:', error);
        throw error;
      }
      
      console.log('User connected to tenant successfully:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User connected to tenant successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to connect user to tenant:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect user to tenant',
        variant: 'destructive',
      });
    },
  });
};

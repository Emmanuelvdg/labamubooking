
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
      
      // First verify the current session to ensure we have proper auth context
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session error');
      }
      
      if (!sessionData.session) {
        console.error('No active session found');
        throw new Error('No active authentication session');
      }
      
      if (sessionData.session.user.id !== userId) {
        console.error('Session user mismatch:', {
          sessionUserId: sessionData.session.user.id,
          requestedUserId: userId
        });
        throw new Error('User ID mismatch with current session');
      }
      
      console.log('Session verified, current user:', sessionData.session.user.email);
      
      // Double-check that we can access the current user via auth.uid()
      const { data: currentUserCheck, error: userCheckError } = await supabase
        .from('user_tenants')
        .select('user_id')
        .eq('user_id', userId)
        .limit(1);
      
      if (userCheckError && !userCheckError.message.includes('no rows')) {
        console.error('Error checking user access:', userCheckError);
        throw new Error('Database access verification failed');
      }
      
      console.log('User access verified, inserting user_tenant record');
      
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
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('User connected to tenant successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Connection successful:', data);
    },
    onError: (error) => {
      console.error('Failed to connect user to tenant:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Failed to connect user to tenant';
      
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Authentication verification failed. Please try logging out and logging back in.';
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'User is already associated with this tenant.';
      } else if (error.message?.includes('session')) {
        errorMessage = 'Authentication session expired. Please refresh the page and try again.';
      } else if (error.message?.includes('mismatch')) {
        errorMessage = 'Authentication error. Please log out and log back in.';
      }
      
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

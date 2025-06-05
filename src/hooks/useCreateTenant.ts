
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { useAuthManagement } from './useAuthManagement';
import { useTenantCreation } from './useTenantCreation';
import { useConnectUserToTenant } from './useTenantConnection';
import { CreateTenantData, CreateTenantResult } from '@/types/tenant';
import { getTenantCreationErrorMessage, getTenantCreationSuccessMessage } from '@/utils/tenantErrorMessages';

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  const connectUserToTenant = useConnectUserToTenant();
  const { refetchTenant } = useTenant();
  const { handleUserAuthentication } = useAuthManagement();
  const { createTenantRecord } = useTenantCreation();
  
  return useMutation({
    mutationFn: async (tenantData: CreateTenantData): Promise<CreateTenantResult> => {
      console.log('Creating new tenant with fresh database state:', { ...tenantData, password: '[REDACTED]' });
      
      // Handle user authentication first
      const { authData, isExistingUser } = await handleUserAuthentication(tenantData.email, tenantData.password);
      console.log('User authentication completed. User ID:', authData.user.id, 'Existing user:', isExistingUser);
      
      // Create the tenant record
      const tenantRecord = await createTenantRecord(tenantData);
      console.log('Tenant record created successfully:', tenantRecord.id);
      
      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Connect the user to the tenant as owner
      console.log('Connecting user to tenant as owner...');
      try {
        await connectUserToTenant.mutateAsync({
          userId: authData.user.id,
          tenantId: tenantRecord.id,
          role: 'owner'
        });
        console.log('User successfully connected to tenant as owner');
      } catch (connectionError) {
        console.error('Failed to connect user to tenant:', connectionError);
        throw new Error('Failed to associate user with tenant. Please try refreshing the page and logging in.');
      }
      
      // Ensure tenant context is refreshed with new data
      console.log('Refreshing tenant context with new business...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refetchTenant();
      
      return {
        id: tenantRecord.id,
        name: tenantRecord.name,
        businessType: tenantRecord.business_type,
        createdAt: tenantRecord.created_at,
        user: authData.user,
        session: authData.session,
        isExistingUser
      } as CreateTenantResult;
    },
    onSuccess: (data) => {
      console.log('Tenant creation completed successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-details'] });
      
      const emailConfirmed = data.user && data.user.email_confirmed_at;
      const message = getTenantCreationSuccessMessage(data.isExistingUser, !!emailConfirmed);
      
      toast({
        title: message.title,
        description: message.description,
      });
    },
    onError: (error) => {
      console.error('Tenant creation failed:', error);
      
      const errorMessage = getTenantCreationErrorMessage(error);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

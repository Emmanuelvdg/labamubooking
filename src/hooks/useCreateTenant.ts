
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
      console.log('Creating new tenant with enhanced synchronization:', { ...tenantData, password: '[REDACTED]' });
      
      // Handle user authentication first with enhanced error handling
      const { authData, isExistingUser } = await handleUserAuthentication(tenantData.email, tenantData.password);
      console.log('User authentication completed. User ID:', authData.user.id, 'Existing user:', isExistingUser);
      
      // Create the tenant record
      const tenantRecord = await createTenantRecord(tenantData);
      console.log('Tenant record created successfully:', tenantRecord.id);
      
      // Enhanced delay for database consistency
      console.log('Ensuring database consistency before user-tenant connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Connect the user to the tenant as owner with retry logic
      console.log('Connecting user to tenant as owner...');
      let connectionAttempts = 0;
      const maxConnectionAttempts = 3;
      
      while (connectionAttempts < maxConnectionAttempts) {
        try {
          await connectUserToTenant.mutateAsync({
            userId: authData.user.id,
            tenantId: tenantRecord.id,
            role: 'owner'
          });
          console.log('User successfully connected to tenant as owner');
          break;
        } catch (connectionError) {
          connectionAttempts++;
          console.error(`Connection attempt ${connectionAttempts} failed:`, connectionError);
          
          if (connectionAttempts >= maxConnectionAttempts) {
            throw new Error('Failed to associate user with tenant after multiple attempts. Please try refreshing the page and logging in.');
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * connectionAttempts));
        }
      }
      
      // Enhanced tenant context refresh with verification
      console.log('Refreshing tenant context with new business...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verify tenant context refresh worked
      let refreshAttempts = 0;
      const maxRefreshAttempts = 3;
      
      while (refreshAttempts < maxRefreshAttempts) {
        try {
          await refetchTenant();
          console.log(`Tenant context refresh attempt ${refreshAttempts + 1} completed`);
          
          // Add a small delay to allow the context to update
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        } catch (refreshError) {
          refreshAttempts++;
          console.error(`Tenant refresh attempt ${refreshAttempts} failed:`, refreshError);
          
          if (refreshAttempts < maxRefreshAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
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

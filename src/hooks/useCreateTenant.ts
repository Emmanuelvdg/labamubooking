
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
      console.log('Creating new tenant with clean data state:', { ...tenantData, password: '[REDACTED]' });
      
      // Handle user authentication
      const { authData, isExistingUser } = await handleUserAuthentication(tenantData.email, tenantData.password);
      
      // Create the tenant record
      const tenantRecord = await createTenantRecord(tenantData);
      
      // Connect the user to the tenant as owner
      console.log('Preparing to connect user to tenant...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        await connectUserToTenant.mutateAsync({
          userId: authData.user.id,
          tenantId: tenantRecord.id,
          role: 'owner'
        });
        console.log('User connected to tenant as owner - tenant starts with clean slate');
      } catch (connectionError) {
        console.error('Failed to connect user to tenant:', connectionError);
        
        // Provide more specific error message
        if (connectionError.message?.includes('row-level security')) {
          throw new Error('Account creation succeeded but user association failed due to authentication issues. Please try refreshing the page and logging in manually.');
        } else {
          throw new Error('Failed to associate user with tenant. The business was created but you may need to contact support to complete the setup.');
        }
      }
      
      // Refetch tenant context after successful creation
      console.log('Tenant creation complete, refreshing tenant context...');
      await new Promise(resolve => setTimeout(resolve, 500));
      await refetchTenant();
      
      // Transform response back to camelCase for frontend
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
      console.log('Tenant created successfully with clean data state, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      // Check if email confirmation is required
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

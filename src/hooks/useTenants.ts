
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useConnectUserToTenant } from './useTenantConnection';

interface CreateTenantData {
  businessName: string;
  businessType: string;
  description?: string;
  ownerName: string;
  email: string;
  phone?: string;
  password: string;
}

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  const connectUserToTenant = useConnectUserToTenant();
  
  return useMutation({
    mutationFn: async (tenantData: CreateTenantData) => {
      console.log('Creating new tenant with clean data state:', { ...tenantData, password: '[REDACTED]' });
      
      // First, create the user account with email confirmation disabled for development
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: tenantData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: tenantData.ownerName,
          }
        }
      });

      if (authError) {
        console.error('Error creating user account:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('User account created successfully:', authData.user.email);

      // Wait a bit to ensure the auth session is properly established
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create the tenant record with only the provided data - no synthetic data
      const dbTenant = {
        name: tenantData.businessName,
        business_type: tenantData.businessType,
        description: tenantData.description || null,
        owner_name: tenantData.ownerName,
        email: tenantData.email,
        phone: tenantData.phone || null,
      };

      console.log('Creating tenant record with clean data:', dbTenant);

      const { data, error } = await supabase
        .from('tenants')
        .insert([dbTenant])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tenant:', error);
        throw error;
      }
      
      console.log('Tenant created successfully with empty data tables:', data);
      
      // Connect the user to the tenant as owner
      // Wait a bit more to ensure auth context is fully established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await connectUserToTenant.mutateAsync({
          userId: authData.user.id,
          tenantId: data.id,
          role: 'owner'
        });
        console.log('User connected to tenant as owner - tenant starts with clean slate');
      } catch (connectionError) {
        console.error('Failed to connect user to tenant:', connectionError);
        // Log the detailed error for debugging
        console.error('Connection error details:', connectionError);
        throw new Error('Failed to associate user with tenant');
      }
      
      // Transform response back to camelCase for frontend
      // Note: New tenant will have empty customers, bookings, services, and staff tables
      return {
        id: data.id,
        name: data.name,
        businessType: data.business_type,
        createdAt: data.created_at,
        user: authData.user,
        session: authData.session,
      } as Tenant & { user: typeof authData.user; session: typeof authData.session };
    },
    onSuccess: (data) => {
      console.log('Tenant created successfully with clean data state, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Business Created Successfully!',
          description: 'Please check your email and click the confirmation link to complete your account setup. Your business starts with a clean slate - add your data as needed.',
        });
      } else {
        toast({
          title: 'Business Created Successfully!',
          description: 'Welcome to BookingPro. Your business account is ready and starts with empty data tables. You can now add your customers, services, and staff.',
        });
      }
    },
    onError: (error) => {
      console.error('Tenant creation failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to create business and account';
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please use a different email or sign in instead.';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters long';
      } else if (error.message?.includes('email') || error.message?.includes('Email')) {
        errorMessage = 'Please enter a valid email address with a real domain (e.g., gmail.com, outlook.com)';
      } else if (error.message?.includes('invalid')) {
        errorMessage = 'Please check your information and try again. Make sure to use a real email address.';
      } else if (error.message?.includes('associate user with tenant')) {
        errorMessage = 'Business was created but failed to link to your account. Please contact support.';
      } else if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        errorMessage = 'Account creation encountered a security policy issue. Please try again or contact support.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

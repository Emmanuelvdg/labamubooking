
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types';
import { toast } from '@/hooks/use-toast';

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
  
  return useMutation({
    mutationFn: async (tenantData: CreateTenantData) => {
      console.log('Creating tenant and user account:', { ...tenantData, password: '[REDACTED]' });
      
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
      console.log('User confirmation status:', {
        emailConfirmed: authData.user.email_confirmed_at,
        userConfirmed: authData.user.confirmed_at
      });

      // Then create the tenant record
      const dbTenant = {
        name: tenantData.businessName,
        business_type: tenantData.businessType,
        description: tenantData.description || null,
        owner_name: tenantData.ownerName,
        email: tenantData.email,
        phone: tenantData.phone || null,
      };

      console.log('Creating tenant record:', dbTenant);

      const { data, error } = await supabase
        .from('tenants')
        .insert([dbTenant])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tenant:', error);
        // If tenant creation fails, we should clean up the user account
        // But for now, we'll just throw the error
        throw error;
      }
      
      console.log('Tenant created successfully:', data);
      
      // Transform response back to camelCase for frontend
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
      console.log('Tenant and user creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Business Created Successfully!',
          description: 'Please check your email and click the confirmation link to complete your account setup.',
        });
      } else {
        toast({
          title: 'Business Created Successfully!',
          description: 'Welcome to BookingPro. You are now logged in and ready to use your dashboard.',
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
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

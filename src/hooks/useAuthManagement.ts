
import { supabase } from '@/integrations/supabase/client';

export const useAuthManagement = () => {
  const handleUserAuthentication = async (email: string, password: string) => {
    console.log('Handling user authentication for:', email);
    
    // Check if user is already logged in
    const { data: currentSession } = await supabase.auth.getSession();
    let authData;
    let isExistingUser = false;
    
    if (currentSession.session && currentSession.session.user.email === email) {
      // User is already logged in with the same email, use existing session
      console.log('User is already logged in with this email, using existing session');
      authData = {
        user: currentSession.session.user,
        session: currentSession.session
      };
      isExistingUser = true;
    } else {
      // Try to create a new user account
      console.log('Attempting to create new user account');
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: email.split('@')[0], // Fallback name
          }
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          // User exists, try to sign them in
          console.log('User already exists, attempting to sign in');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error('Failed to sign in existing user:', signInError);
            throw new Error('An account with this email already exists. Please use the correct password or use a different email.');
          }

          authData = signInData;
          isExistingUser = true;
          console.log('Successfully signed in existing user');
        } else {
          console.error('Error creating user account:', authError);
          throw authError;
        }
      } else {
        authData = signUpData;
        console.log('User account created successfully:', authData.user?.email);
      }
    }

    if (!authData.user) {
      throw new Error('Failed to authenticate user');
    }

    // Wait for auth session to stabilize
    console.log('Waiting for auth session to stabilize...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify the session is still active and accessible
    const { data: verifySession, error: verifyError } = await supabase.auth.getSession();
    if (verifyError || !verifySession.session) {
      console.error('Session verification failed:', verifyError);
      throw new Error('Authentication session failed to establish properly');
    }
    
    console.log('Auth session verified, user ID:', verifySession.session.user.id);

    return { authData, isExistingUser };
  };

  return { handleUserAuthentication };
};

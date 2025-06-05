
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, 'Session ID:', session?.access_token?.substring(0, 10) + '...');
        
        // Always update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        
        // If this is a sign-in event, add extra delay to ensure database consistency
        if (event === 'SIGNED_IN' && session) {
          console.log('SIGNED_IN event detected, ensuring database consistency...');
          // Give the database extra time to process any pending writes
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session check:', session?.user?.email, 'Session ID:', session?.access_token?.substring(0, 10) + '...');
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
};

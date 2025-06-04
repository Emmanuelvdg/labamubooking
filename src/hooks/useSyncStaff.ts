
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ExternalStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  skills?: string[];
  is_active?: boolean;
}

export const useSyncStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tenantId: string) => {
      console.log('Starting staff sync for tenant:', tenantId);
      
      // Fetch staff from external API
      const response = await fetch('https://www.labamu.co.id/employees');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const externalStaff: ExternalStaff[] = await response.json();
      console.log('Fetched external staff:', externalStaff);
      
      if (!Array.isArray(externalStaff)) {
        throw new Error('Invalid response format from external API');
      }
      
      // Transform and insert staff data
      const staffToInsert = externalStaff.map(staff => ({
        tenant_id: tenantId,
        name: staff.name,
        email: staff.email,
        role: staff.role || 'Staff',
        skills: staff.skills || [],
        is_active: staff.is_active !== undefined ? staff.is_active : true,
      }));
      
      console.log('Inserting staff:', staffToInsert);
      
      const { data, error } = await supabase
        .from('staff')
        .upsert(staffToInsert, { 
          onConflict: 'email,tenant_id',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Successfully synced staff:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: `Successfully synced ${data?.length || 0} staff members`,
      });
    },
    onError: (error) => {
      console.error('Sync failed:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync staff from external system',
        variant: 'destructive',
      });
    },
  });
};

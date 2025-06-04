
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BusinessType {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ['businessTypes'],
    queryFn: async () => {
      console.log('Fetching business types from database...');
      
      const { data, error } = await supabase
        .from('business_types')
        .select('id, name, display_order, is_active')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching business types:', error);
        throw error;
      }
      
      console.log('Business types fetched:', data);
      return data as BusinessType[];
    },
  });
};

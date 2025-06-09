
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const useSyncServices = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tenantId: string) => {
      console.log('Syncing services from Labamu for tenant:', tenantId);
      
      try {
        const response = await fetch('https://www.labamu.co.id/v1/catalog', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch catalog: ${response.status} ${response.statusText}`);
        }
        
        const catalogData = await response.json();
        console.log('Fetched catalog data:', catalogData);
        
        // Here you would typically process the catalog data and update your services
        // For now, we'll just return the data
        return catalogData;
      } catch (error) {
        console.error('Error syncing services:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Success',
        description: 'Service catalog synced successfully from Labamu',
      });
      console.log('Services synced successfully:', data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to sync service catalog from Labamu',
        variant: 'destructive',
      });
      console.error('Error syncing services:', error);
    },
  });
};


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateStaff } from '@/hooks/useStaff';
import { toast } from '@/hooks/use-toast';

export const useStaffAvatar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const updateStaff = useUpdateStaff();

  const uploadAvatar = async (file: File, staffId: string, staffData: any) => {
    setIsUploading(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${staffId}-${Math.random()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('staff-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('staff-avatars')
        .getPublicUrl(filePath);

      // Update staff record with new avatar URL
      await updateStaff.mutateAsync({
        ...staffData,
        avatar: publicUrl
      });

      toast({
        title: 'Success',
        description: 'Profile photo updated successfully',
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile photo',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    isUploading
  };
};

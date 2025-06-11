
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useStaffAvatar } from '@/hooks/useStaffAvatar';
import { Staff } from '@/types';

interface AvatarUploadProps {
  staff: Staff;
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
}

export const AvatarUpload = ({ staff, size = 'md', showUploadButton = true }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isUploading } = useStaffAvatar();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-20 w-20'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadAvatar(file, staff.id, staff);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={staff.avatar} alt={staff.name} />
          <AvatarFallback>
            {staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {size === 'lg' && showUploadButton && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showUploadButton && size !== 'lg' && (
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};


import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AvatarUpload } from './AvatarUpload';
import { Staff } from '@/types';

interface StaffAvatarDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StaffAvatarDialog = ({ staff, open, onOpenChange }: StaffAvatarDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-6">
          <AvatarUpload staff={staff} size="lg" showUploadButton={true} />
          <p className="text-sm text-gray-600 text-center">
            Click the camera icon or upload button to change the profile photo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

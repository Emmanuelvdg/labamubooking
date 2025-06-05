
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { EditStaffDialog } from './EditStaffDialog';
import { DeleteStaffDialog } from './DeleteStaffDialog';
import { StaffAccountDialog } from './StaffAccountDialog';
import { Staff } from '@/types';
import { Edit, Trash2, UserCog } from 'lucide-react';

interface StaffActionsProps {
  staff: Staff;
  children: React.ReactNode;
}

export const StaffActions = ({ staff, children }: StaffActionsProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditClick = () => {
    console.log('Edit clicked for staff:', staff.name);
    setEditOpen(true);
  };

  const handleDeleteClick = () => {
    console.log('Delete clicked for staff:', staff.name);
    setDeleteOpen(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <UserCog className="h-4 w-4 mr-2" />
            Manage Account
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditStaffDialog 
        staff={staff}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteStaffDialog 
        staff={staff}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};

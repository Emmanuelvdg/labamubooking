
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { EditStaffDialog } from './EditStaffDialog';
import { DeleteStaffDialog } from './DeleteStaffDialog';
import { Staff } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface StaffActionsProps {
  staff: Staff;
  children: React.ReactNode;
}

export const StaffActions = ({ staff, children }: StaffActionsProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setDeleteOpen(true)}
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

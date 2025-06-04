
import { useState } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { EditCustomerDialog } from './EditCustomerDialog';
import { DeleteCustomerDialog } from './DeleteCustomerDialog';
import { Customer } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface CustomerActionsProps {
  customer: Customer;
  children: React.ReactNode;
}

export const CustomerActions = ({ customer, children }: CustomerActionsProps) => {
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

      <EditCustomerDialog 
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteCustomerDialog 
        customer={customer}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};

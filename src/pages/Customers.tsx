
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Phone, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NewCustomerDialog } from '@/components/customers/NewCustomerDialog';
import { SyncCustomersButton } from '@/components/customers/SyncCustomersButton';
import { CustomerActions } from '@/components/customers/CustomerActions';
import { EditCustomerDialog } from '@/components/customers/EditCustomerDialog';
import { DeleteCustomerDialog } from '@/components/customers/DeleteCustomerDialog';
import { useCustomers } from '@/hooks/useCustomers';
import { useTenant } from '@/contexts/TenantContext';
import { useState } from 'react';

const Customers = () => {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant();
  const { data: customers = [], isLoading, error } = useCustomers(tenantId || '');
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (tenantError || !tenantId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          {tenantError || 'No tenant access found. Please contact support.'}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error loading customers</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <div className="flex gap-2">
          <SyncCustomersButton tenantId={tenantId} />
          <NewCustomerDialog />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search customers..." className="pl-10" />
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No customers found</p>
          <NewCustomerDialog />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <CustomerActions key={customer.id} customer={customer}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{customer.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditCustomer(customer)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteCustomer(customer)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CustomerActions>
          ))}
        </div>
      )}

      {editCustomer && (
        <EditCustomerDialog 
          customer={editCustomer}
          open={!!editCustomer}
          onOpenChange={(open) => !open && setEditCustomer(null)}
        />
      )}

      {deleteCustomer && (
        <DeleteCustomerDialog 
          customer={deleteCustomer}
          open={!!deleteCustomer}
          onOpenChange={(open) => !open && setDeleteCustomer(null)}
        />
      )}
    </div>
  );
};

export default Customers;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Bell, Users, Calendar, CreditCard, Building2 } from 'lucide-react';
import { useTenantDetails } from '@/hooks/useTenantDetails';
import { useTenant } from '@/contexts/TenantContext';
import { Skeleton } from '@/components/ui/skeleton';
import ReminderSettings from '@/components/settings/ReminderSettings';

const Settings = () => {
  const { data: tenant, isLoading, error } = useTenantDetails();
  const { currentTenantRole, availableTenants, tenantId } = useTenant();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your business settings and preferences</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your business settings and preferences</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load business information. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTenantInfo = availableTenants.find(t => t.tenant_id === tenantId);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          {currentTenantRole && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Building2 className="h-3 w-3" />
              <span>{currentTenantRole}</span>
            </Badge>
          )}
        </div>
        <p className="text-gray-600">
          Manage settings for <span className="font-medium">{tenant?.name}</span>
        </p>
        {currentTenantInfo && (
          <p className="text-sm text-gray-500">
            {currentTenantInfo.tenant.business_type} • Your role: {currentTenantRole}
          </p>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue={tenant?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Input id="business-type" defaultValue={tenant?.business_type || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Input id="description" defaultValue={tenant?.description || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner Name</Label>
                <Input id="owner-name" defaultValue={tenant?.owner_name || ''} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={tenant?.phone || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={tenant?.email || ''} />
                </div>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive booking confirmations via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Receive booking reminders via SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive real-time notifications</p>
                </div>
                <Switch />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <ReminderSettings />
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage team permissions and access levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow staff to manage their own schedules</Label>
                  <p className="text-sm text-gray-600">Staff can update their availability</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Staff can view all bookings</Label>
                  <p className="text-sm text-gray-600">Allow staff to see bookings of other team members</p>
                </div>
                <Switch />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Settings
              </CardTitle>
              <CardDescription>
                Configure booking rules and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advance-booking">Advance Booking (days)</Label>
                  <Input id="advance-booking" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
                  <Input id="cancellation-window" type="number" defaultValue="24" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require customer confirmation</Label>
                  <p className="text-sm text-gray-600">Customers must confirm their booking</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Billing & Payments
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Current Plan: Professional</h3>
                <p className="text-sm text-gray-600">$29/month • Billed monthly</p>
                <p className="text-sm text-gray-600 mt-2">Next billing date: July 5, 2024</p>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="border rounded-lg p-4">
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

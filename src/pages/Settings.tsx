
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building2, Users, Settings as SettingsIcon, Puzzle } from 'lucide-react';
import { BusinessSettingsForm } from '@/components/settings/BusinessSettingsForm';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="addons" className="flex items-center">
            <Puzzle className="h-4 w-4 mr-2" />
            Add-ons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic settings for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">General settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <BusinessSettingsForm />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">User management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add-ons & Integrations</CardTitle>
              <CardDescription>
                Extend your business with powerful integrations and add-ons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Connect with popular booking platforms and extend your business capabilities.
                </p>
                <Button onClick={() => navigate('/addons')}>
                  <Puzzle className="h-4 w-4 mr-2" />
                  Manage Add-ons
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

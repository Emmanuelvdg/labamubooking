
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings as SettingsIcon, Globe, UserCheck, Briefcase } from 'lucide-react';
import { BusinessSettingsForm } from '@/components/settings/BusinessSettingsForm';
import { GeneralSettingsForm } from '@/components/settings/GeneralSettingsForm';
import { PublicBookingProfileForm } from '@/components/settings/PublicBookingProfileForm';
import { BookingSettingsForm } from '@/components/settings/BookingSettingsForm';
import { PublicStaffProfilesForm } from '@/components/settings/PublicStaffProfilesForm';
import { PublicServiceProfilesForm } from '@/components/settings/PublicServiceProfilesForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('settings')}</h1>
        <p className="text-gray-600">{t('manage_business_settings')}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            {t('general')}
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            {t('business')}
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Online Booking
          </TabsTrigger>
          <TabsTrigger value="staff-profiles" className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Staff Profiles
          </TabsTrigger>
          <TabsTrigger value="service-profiles" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Service Profiles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t('users')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettingsForm />
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <BusinessSettingsForm />
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <PublicBookingProfileForm />
          <BookingSettingsForm />
        </TabsContent>

        <TabsContent value="staff-profiles" className="space-y-6">
          <PublicStaffProfilesForm />
        </TabsContent>

        <TabsContent value="service-profiles" className="space-y-6">
          <PublicServiceProfilesForm />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('user_management')}</CardTitle>
              <CardDescription>
                {t('manage_user_accounts')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('user_management_available')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

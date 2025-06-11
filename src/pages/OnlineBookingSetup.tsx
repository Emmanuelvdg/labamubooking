
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, UserCheck, Briefcase, Settings as SettingsIcon } from 'lucide-react';
import { PublicBookingProfileForm } from '@/components/settings/PublicBookingProfileForm';
import { BookingSettingsForm } from '@/components/settings/BookingSettingsForm';
import { PublicStaffProfilesForm } from '@/components/settings/PublicStaffProfilesForm';
import { PublicServiceProfilesForm } from '@/components/settings/PublicServiceProfilesForm';
import { useLanguage } from '@/contexts/LanguageContext';

const OnlineBookingSetup = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Online Booking Setup</h1>
        <p className="text-gray-600">Configure your online booking system and public profiles</p>
      </div>

      <Tabs defaultValue="booking-profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="booking-profile" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Booking Profile
          </TabsTrigger>
          <TabsTrigger value="booking-settings" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Booking Settings
          </TabsTrigger>
          <TabsTrigger value="staff-profiles" className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Staff Profiles
          </TabsTrigger>
          <TabsTrigger value="service-profiles" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Service Profiles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="booking-profile" className="space-y-6">
          <PublicBookingProfileForm />
        </TabsContent>

        <TabsContent value="booking-settings" className="space-y-6">
          <BookingSettingsForm />
        </TabsContent>

        <TabsContent value="staff-profiles" className="space-y-6">
          <PublicStaffProfilesForm />
        </TabsContent>

        <TabsContent value="service-profiles" className="space-y-6">
          <PublicServiceProfilesForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnlineBookingSetup;

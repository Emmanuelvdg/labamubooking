
import { useParams, useSearchParams } from 'react-router-dom';
import { usePublicBusinessProfile, useBookingSettings, usePublicStaffProfiles, usePublicServiceProfiles } from '@/hooks/useOnlineBookings';
import { PublicBookingHeader } from '@/components/public-booking/PublicBookingHeader';
import { PublicBookingForm } from '@/components/public-booking/PublicBookingForm';
import { PublicBookingLoading } from '@/components/public-booking/PublicBookingLoading';
import { PublicBookingError } from '@/components/public-booking/PublicBookingError';

const PublicBooking = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  const { data: businessProfile, isLoading: businessLoading, error: businessError } = usePublicBusinessProfile(slug || '');
  const { data: bookingSettings, isLoading: settingsLoading } = useBookingSettings(businessProfile?.tenantId || '');
  const { data: staffProfiles, isLoading: staffLoading } = usePublicStaffProfiles(businessProfile?.tenantId || '');
  const { data: serviceProfiles, isLoading: servicesLoading } = usePublicServiceProfiles(businessProfile?.tenantId || '');

  const isLoading = businessLoading || settingsLoading || staffLoading || servicesLoading;

  if (isLoading) {
    return <PublicBookingLoading />;
  }

  if (businessError || !businessProfile) {
    return <PublicBookingError error={businessError} />;
  }

  const preSelectedService = searchParams.get('service');
  const preSelectedStaff = searchParams.get('staff');

  return (
    <div className="min-h-screen bg-background">
      <PublicBookingHeader 
        businessProfile={businessProfile}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PublicBookingForm
                businessProfile={businessProfile}
                bookingSettings={bookingSettings}
                staffProfiles={staffProfiles || []}
                serviceProfiles={serviceProfiles || []}
                preSelectedService={preSelectedService}
                preSelectedStaff={preSelectedStaff}
              />
            </div>
            
            <div className="space-y-6">
              {/* Business info sidebar */}
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {businessProfile.contactPhone && (
                    <p>📞 {businessProfile.contactPhone}</p>
                  )}
                  {businessProfile.contactEmail && (
                    <p>✉️ {businessProfile.contactEmail}</p>
                  )}
                  {businessProfile.address && (
                    <p>📍 {businessProfile.address}</p>
                  )}
                </div>
              </div>

              {bookingSettings?.cancellationPolicy && (
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Cancellation Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    {bookingSettings.cancellationPolicy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;

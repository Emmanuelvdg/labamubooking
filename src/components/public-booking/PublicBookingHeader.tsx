
import { PublicBusinessProfile } from '@/types/onlineBooking';

interface PublicBookingHeaderProps {
  businessProfile: PublicBusinessProfile;
}

export const PublicBookingHeader = ({ businessProfile }: PublicBookingHeaderProps) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      {businessProfile.coverImageUrl && (
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${businessProfile.coverImageUrl})` }}
        />
      )}
      
      {/* Business Info */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {businessProfile.logoUrl && (
              <img 
                src={businessProfile.logoUrl} 
                alt={`${businessProfile.displayName} logo`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {businessProfile.displayName}
              </h1>
              {businessProfile.description && (
                <p className="text-gray-600 mt-1">
                  {businessProfile.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

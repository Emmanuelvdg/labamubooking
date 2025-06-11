
import { IntegrationCard } from './IntegrationCard';
import { useAddonIntegrations } from '@/hooks/useAddonIntegrations';

const integrationConfigs = [
  {
    type: 'google_reserve' as const,
    name: 'Google Reserve',
    description: 'Allow customers to book directly through Google Search and Maps',
    icon: '🔍',
    features: ['Google Search visibility', 'Maps integration', 'Automatic syncing'],
    status: 'available' as const
  },
  {
    type: 'facebook_booking' as const,
    name: 'Facebook Booking',
    description: 'Enable bookings directly from your Facebook business page',
    icon: '📘',
    features: ['Facebook page integration', 'Social media reach', 'Real-time sync'],
    status: 'available' as const
  },
  {
    type: 'instagram_booking' as const,
    name: 'Instagram Booking',
    description: 'Connect your Instagram business profile for easy booking',
    icon: '📸',
    features: ['Instagram Stories', 'Profile booking button', 'Visual engagement'],
    status: 'available' as const
  }
];

export const BookingIntegrationsGrid = () => {
  const { integrations, updateIntegration, isUpdating } = useAddonIntegrations();

  const getIntegrationStatus = (type: string) => {
    const integration = integrations.find(i => i.integration_type === type);
    return integration?.is_enabled ? 'enabled' : 'disabled';
  };

  const handleToggleIntegration = (type: any, enabled: boolean) => {
    updateIntegration({
      integration_type: type,
      updates: { is_enabled: enabled }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrationConfigs.map((config) => (
        <IntegrationCard
          key={config.type}
          config={config}
          isEnabled={getIntegrationStatus(config.type) === 'enabled'}
          onToggle={(enabled) => handleToggleIntegration(config.type, enabled)}
          isLoading={isUpdating}
        />
      ))}
    </div>
  );
};

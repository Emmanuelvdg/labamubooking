
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { IntegrationConfigDialog } from './IntegrationConfigDialog';

interface IntegrationConfig {
  type: 'google_reserve' | 'facebook_booking' | 'instagram_booking';
  name: string;
  description: string;
  icon: string;
  features: string[];
  status: 'available' | 'coming_soon';
}

interface IntegrationCardProps {
  config: IntegrationConfig;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isLoading: boolean;
}

export const IntegrationCard = ({ config, isEnabled, onToggle, isLoading }: IntegrationCardProps) => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{config.icon}</div>
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <Badge 
                  variant={config.status === 'available' ? 'default' : 'secondary'}
                  className="text-xs mt-1"
                >
                  {config.status === 'available' ? 'Available' : 'Coming Soon'}
                </Badge>
              </div>
            </div>
            {config.status === 'available' && (
              <Switch
                checked={isEnabled}
                onCheckedChange={onToggle}
                disabled={isLoading}
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{config.description}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {config.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {config.status === 'available' && isEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </CardContent>
      </Card>

      <IntegrationConfigDialog
        open={showConfig}
        onOpenChange={setShowConfig}
        integrationType={config.type}
        integrationName={config.name}
      />
    </>
  );
};

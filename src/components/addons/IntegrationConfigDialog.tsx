
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddonIntegrations } from '@/hooks/useAddonIntegrations';

interface IntegrationConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationType: 'google_reserve' | 'facebook_booking' | 'instagram_booking';
  integrationName: string;
}

export const IntegrationConfigDialog = ({ 
  open, 
  onOpenChange, 
  integrationType, 
  integrationName 
}: IntegrationConfigDialogProps) => {
  const { integrations, updateIntegration } = useAddonIntegrations();
  const [config, setConfig] = useState({
    api_key: '',
    webhook_url: '',
    sync_frequency: 'hourly',
    auto_import: true
  });

  const currentIntegration = integrations.find(i => i.integration_type === integrationType);

  const handleSave = () => {
    updateIntegration({
      integration_type: integrationType,
      updates: {
        configuration: config,
        api_credentials: {
          api_key: config.api_key
        }
      }
    });
    onOpenChange(false);
  };

  const getConfigFields = () => {
    switch (integrationType) {
      case 'google_reserve':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="google-api-key">Google API Key</Label>
              <Input
                id="google-api-key"
                type="password"
                placeholder="Enter your Google API key"
                value={config.api_key}
                onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="merchant-id">Merchant ID</Label>
              <Input
                id="merchant-id"
                placeholder="Your Google Merchant ID"
              />
            </div>
          </div>
        );
      
      case 'facebook_booking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="facebook-app-id">Facebook App ID</Label>
              <Input
                id="facebook-app-id"
                placeholder="Enter your Facebook App ID"
              />
            </div>
            <div>
              <Label htmlFor="facebook-secret">App Secret</Label>
              <Input
                id="facebook-secret"
                type="password"
                placeholder="Enter your Facebook App Secret"
                value={config.api_key}
                onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'instagram_booking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram-token">Instagram Access Token</Label>
              <Textarea
                id="instagram-token"
                placeholder="Enter your Instagram Business access token"
                value={config.api_key}
                onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure {integrationName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Configuration</CardTitle>
              <CardDescription>
                Enter your API credentials to connect with {integrationName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getConfigFields()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sync Settings</CardTitle>
              <CardDescription>
                Configure how often bookings are synchronized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/webhook"
                  value={config.webhook_url}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhook_url: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

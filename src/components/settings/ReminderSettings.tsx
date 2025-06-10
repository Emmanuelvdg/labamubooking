
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Mail, Phone, Save, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

interface MessageType {
  id: string;
  name: string;
  description: string;
  category: string;
  default_timing_hours: number;
  default_template: string;
}

interface ReminderConfig {
  id?: string;
  reminder_type: string;
  enabled: boolean;
  channel: string;
  timing_hours?: number;
  message_template?: string;
}

const CHANNELS = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
];

const ReminderSettings = () => {
  const { tenantId } = useTenant();
  const [messageTypes, setMessageTypes] = useState<MessageType[]>([]);
  const [configs, setConfigs] = useState<ReminderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tenantId) {
      loadData();
    }
  }, [tenantId]);

  const loadData = async () => {
    try {
      // Load message types
      const { data: types, error: typesError } = await supabase
        .from('automated_message_types')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (typesError) throw typesError;

      // Load existing configurations
      const { data: existingConfigs, error: configsError } = await supabase
        .from('reminder_configurations')
        .select('*')
        .eq('tenant_id', tenantId);

      if (configsError) throw configsError;

      setMessageTypes(types || []);
      setConfigs(existingConfigs || []);
    } catch (error) {
      console.error('Error loading reminder data:', error);
      toast.error('Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const getConfigForType = (reminderType: string, channel: string): ReminderConfig => {
    return configs.find(c => c.reminder_type === reminderType && c.channel === channel) || {
      reminder_type: reminderType,
      enabled: false,
      channel,
      timing_hours: messageTypes.find(t => t.name === reminderType)?.default_timing_hours || 0,
      message_template: messageTypes.find(t => t.name === reminderType)?.default_template || '',
    };
  };

  const updateConfig = (reminderType: string, channel: string, updates: Partial<ReminderConfig>) => {
    setConfigs(prev => {
      const existing = prev.find(c => c.reminder_type === reminderType && c.channel === channel);
      if (existing) {
        return prev.map(c => 
          c.reminder_type === reminderType && c.channel === channel 
            ? { ...c, ...updates }
            : c
        );
      } else {
        return [...prev, {
          reminder_type: reminderType,
          channel,
          enabled: false,
          ...updates,
        }];
      }
    });
  };

  const saveConfigurations = async () => {
    if (!tenantId) return;

    setSaving(true);
    try {
      // Prepare data for upsert
      const configsToSave = configs
        .filter(config => config.enabled || config.id) // Only save enabled configs or existing ones
        .map(config => ({
          ...config,
          tenant_id: tenantId,
        }));

      // Upsert configurations
      const { error } = await supabase
        .from('reminder_configurations')
        .upsert(configsToSave, {
          onConflict: 'tenant_id,reminder_type,channel'
        });

      if (error) throw error;

      toast.success('Reminder settings saved successfully!');
      await loadData(); // Reload to get IDs for new records
    } catch (error) {
      console.error('Error saving configurations:', error);
      toast.error('Failed to save reminder settings');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reminders': return Bell;
      case 'updates': return MessageSquare;
      case 'marketing': return Mail;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reminders': return 'bg-blue-100 text-blue-800';
      case 'updates': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Loading reminder configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const groupedTypes = messageTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, MessageType[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Reminder Settings
        </CardTitle>
        <CardDescription>
          Configure automated reminders and notifications for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedTypes).map(([category, types]) => {
          const CategoryIcon = getCategoryIcon(category);
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center space-x-2">
                <CategoryIcon className="h-4 w-4" />
                <h3 className="text-lg font-medium capitalize">{category}</h3>
                <Badge className={getCategoryColor(category)}>
                  {types.length} type{types.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {types.map((messageType) => (
                <div key={messageType.id} className="border rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium">{messageType.name}</h4>
                    <p className="text-sm text-gray-600">{messageType.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CHANNELS.map((channel) => {
                      const ChannelIcon = channel.icon;
                      const config = getConfigForType(messageType.name, channel.value);
                      
                      return (
                        <div key={channel.value} className="border rounded p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ChannelIcon className="h-4 w-4" />
                              <span className="font-medium">{channel.label}</span>
                            </div>
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={(enabled) => 
                                updateConfig(messageType.name, channel.value, { enabled })
                              }
                            />
                          </div>

                          {config.enabled && (
                            <div className="space-y-3">
                              {messageType.category === 'reminders' && (
                                <div>
                                  <Label className="text-xs">Timing (hours before)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="168"
                                    value={config.timing_hours || 0}
                                    onChange={(e) => 
                                      updateConfig(messageType.name, channel.value, { 
                                        timing_hours: parseInt(e.target.value) || 0 
                                      })
                                    }
                                    className="h-8"
                                  />
                                </div>
                              )}

                              <div>
                                <Label className="text-xs">Message Template</Label>
                                <Textarea
                                  value={config.message_template || ''}
                                  onChange={(e) => 
                                    updateConfig(messageType.name, channel.value, { 
                                      message_template: e.target.value 
                                    })
                                  }
                                  placeholder="Enter message template..."
                                  className="h-20 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Available variables: {'{customer_name}'}, {'{appointment_time}'}, {'{service_name}'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {category !== Object.keys(groupedTypes)[Object.keys(groupedTypes).length - 1] && (
                <Separator />
              )}
            </div>
          );
        })}

        <div className="flex justify-end pt-4">
          <Button onClick={saveConfigurations} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Reminder Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;

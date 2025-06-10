
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { useReminderConfigurations } from '@/hooks/useReminderConfigurations';
import { toast } from 'sonner';
import { useState } from 'react';

const CHANNELS = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
];

const ReminderSettings = () => {
  const {
    configurations,
    messageTypes,
    isLoading,
    error,
    upsertConfiguration,
    isUpserting,
  } = useReminderConfigurations();

  const [localConfigs, setLocalConfigs] = useState<Record<string, any>>({});

  const getConfigForType = (reminderType: string, channel: string) => {
    const key = `${reminderType}-${channel}`;
    if (localConfigs[key]) {
      return localConfigs[key];
    }

    const existing = configurations.find(
      c => c.reminder_type === reminderType && c.channel === channel
    );
    
    if (existing) {
      return existing;
    }

    const messageType = messageTypes.find(t => t.name === reminderType);
    return {
      reminder_type: reminderType,
      enabled: false,
      channel,
      timing_hours: messageType?.default_timing_hours || 0,
      message_template: messageType?.default_template || '',
    };
  };

  const updateConfig = (reminderType: string, channel: string, updates: any) => {
    const key = `${reminderType}-${channel}`;
    const currentConfig = getConfigForType(reminderType, channel);
    setLocalConfigs(prev => ({
      ...prev,
      [key]: { ...currentConfig, ...updates }
    }));
  };

  const handleSave = async () => {
    try {
      // Save all local configs
      const promises = Object.values(localConfigs).map((config: any) => {
        if (config.enabled || config.id) {
          return new Promise((resolve) => {
            upsertConfiguration(config);
            resolve(config);
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setLocalConfigs({});
      toast.success('Reminder settings saved successfully!');
    } catch (error) {
      console.error('Error saving configurations:', error);
      toast.error('Failed to save reminder settings');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reminders': return Bell;
      case 'updates': return MessageSquare;
      case 'marketing': return Mail;
      default: return Bell;
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Loading reminder configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Error loading reminder settings</CardDescription>
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
  }, {} as Record<string, typeof messageTypes>);

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
          <Button 
            onClick={handleSave} 
            disabled={isUpserting || Object.keys(localConfigs).length === 0}
          >
            {isUpserting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isUpserting ? 'Saving...' : 'Save Reminder Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;

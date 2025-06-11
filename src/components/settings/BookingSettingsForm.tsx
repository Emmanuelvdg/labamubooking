
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface BookingSettings {
  id?: string;
  advanceBookingDays: number;
  minAdvanceHours: number;
  maxAdvanceHours: number;
  allowSameDayBooking: boolean;
  requireCustomerPhone: boolean;
  requireCustomerNotes: boolean;
  autoConfirmBookings: boolean;
  sendConfirmationEmail: boolean;
  sendReminderEmail: boolean;
  reminderHoursBefore: number;
  cancellationPolicy?: string;
  termsAndConditions?: string;
}

export const BookingSettingsForm = () => {
  const { toast } = useToast();
  const { tenantId } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<BookingSettings>({
    advanceBookingDays: 30,
    minAdvanceHours: 2,
    maxAdvanceHours: 720,
    allowSameDayBooking: true,
    requireCustomerPhone: false,
    requireCustomerNotes: false,
    autoConfirmBookings: false,
    sendConfirmationEmail: true,
    sendReminderEmail: true,
    reminderHoursBefore: 24,
    cancellationPolicy: '',
    termsAndConditions: ''
  });

  useEffect(() => {
    if (tenantId) {
      fetchSettings();
    }
  }, [tenantId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          advanceBookingDays: data.advance_booking_days,
          minAdvanceHours: data.min_advance_hours,
          maxAdvanceHours: data.max_advance_hours,
          allowSameDayBooking: data.allow_same_day_booking,
          requireCustomerPhone: data.require_customer_phone,
          requireCustomerNotes: data.require_customer_notes,
          autoConfirmBookings: data.auto_confirm_bookings,
          sendConfirmationEmail: data.send_confirmation_email,
          sendReminderEmail: data.send_reminder_email,
          reminderHoursBefore: data.reminder_hours_before,
          cancellationPolicy: data.cancellation_policy || '',
          termsAndConditions: data.terms_and_conditions || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load booking settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) {
      toast({
        title: "Error",
        description: "No tenant selected",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const settingsData = {
        tenant_id: tenantId,
        advance_booking_days: settings.advanceBookingDays,
        min_advance_hours: settings.minAdvanceHours,
        max_advance_hours: settings.maxAdvanceHours,
        allow_same_day_booking: settings.allowSameDayBooking,
        require_customer_phone: settings.requireCustomerPhone,
        require_customer_notes: settings.requireCustomerNotes,
        auto_confirm_bookings: settings.autoConfirmBookings,
        send_confirmation_email: settings.sendConfirmationEmail,
        send_reminder_email: settings.sendReminderEmail,
        reminder_hours_before: settings.reminderHoursBefore,
        cancellation_policy: settings.cancellationPolicy,
        terms_and_conditions: settings.termsAndConditions,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('booking_settings')
        .upsert(settingsData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking settings saved successfully",
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save booking settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading booking settings...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Settings</CardTitle>
        <CardDescription>
          Configure how online bookings work for your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="advanceBookingDays">Advance Booking Days</Label>
              <Input
                id="advanceBookingDays"
                type="number"
                min="1"
                max="365"
                value={settings.advanceBookingDays}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  advanceBookingDays: parseInt(e.target.value) || 30 
                }))}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="minAdvanceHours">Min Advance Hours</Label>
              <Input
                id="minAdvanceHours"
                type="number"
                min="0"
                max="72"
                value={settings.minAdvanceHours}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  minAdvanceHours: parseInt(e.target.value) || 2 
                }))}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="reminderHoursBefore">Reminder Hours Before</Label>
              <Input
                id="reminderHoursBefore"
                type="number"
                min="1"
                max="168"
                value={settings.reminderHoursBefore}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  reminderHoursBefore: parseInt(e.target.value) || 24 
                }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="allowSameDayBooking"
                checked={settings.allowSameDayBooking}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, allowSameDayBooking: checked }))
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="allowSameDayBooking">Allow Same Day Booking</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requireCustomerPhone"
                checked={settings.requireCustomerPhone}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, requireCustomerPhone: checked }))
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="requireCustomerPhone">Require Customer Phone</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoConfirmBookings"
                checked={settings.autoConfirmBookings}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoConfirmBookings: checked }))
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="autoConfirmBookings">Auto Confirm Bookings</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sendConfirmationEmail"
                checked={settings.sendConfirmationEmail}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sendConfirmationEmail: checked }))
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="sendConfirmationEmail">Send Confirmation Email</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sendReminderEmail"
                checked={settings.sendReminderEmail}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sendReminderEmail: checked }))
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="sendReminderEmail">Send Reminder Email</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <Textarea
              id="cancellationPolicy"
              value={settings.cancellationPolicy}
              onChange={(e) => setSettings(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
              placeholder="Describe your cancellation policy..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={settings.termsAndConditions}
              onChange={(e) => setSettings(prev => ({ ...prev, termsAndConditions: e.target.value }))}
              placeholder="Enter your terms and conditions..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? "Saving..." : "Save Booking Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

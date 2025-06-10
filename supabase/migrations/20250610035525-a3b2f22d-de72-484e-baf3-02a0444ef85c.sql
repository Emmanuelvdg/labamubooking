
-- Create table for reminder configurations
CREATE TABLE public.reminder_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  reminder_type TEXT NOT NULL, -- 'appointment_reminder', 'appointment_update', 'thank_you', etc.
  enabled BOOLEAN NOT NULL DEFAULT false,
  channel TEXT NOT NULL, -- 'sms', 'whatsapp', 'email'
  timing_hours INTEGER, -- Hours before appointment (for reminders)
  message_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, reminder_type, channel)
);

-- Create table for automated message types
CREATE TABLE public.automated_message_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'reminders', 'updates', 'marketing', etc.
  default_timing_hours INTEGER,
  default_template TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default automated message types
INSERT INTO public.automated_message_types (name, description, category, default_timing_hours, default_template) VALUES
('24 Hour Reminder', 'Reminder sent 24 hours before appointment', 'reminders', 24, 'Hi {customer_name}, this is a reminder that you have an appointment tomorrow at {appointment_time} for {service_name}. See you then!'),
('1 Hour Reminder', 'Reminder sent 1 hour before appointment', 'reminders', 1, 'Hi {customer_name}, your appointment for {service_name} is in 1 hour at {appointment_time}. Looking forward to seeing you!'),
('New Appointment', 'Confirmation when appointment is booked', 'updates', 0, 'Hi {customer_name}, your appointment for {service_name} has been confirmed for {appointment_time}. Thank you for booking with us!'),
('Rescheduled Appointment', 'Notification when appointment is rescheduled', 'updates', 0, 'Hi {customer_name}, your appointment has been rescheduled to {appointment_time} for {service_name}. Thank you for your understanding.'),
('Cancelled Appointment', 'Notification when appointment is cancelled', 'updates', 0, 'Hi {customer_name}, your appointment for {service_name} on {appointment_time} has been cancelled. Please contact us to reschedule.'),
('Appointment Complete', 'Thank you message after appointment', 'updates', 0, 'Thank you for visiting us today, {customer_name}! We hope you enjoyed your {service_name} service. We look forward to seeing you again!'),
('Thank You for Waiting', 'Message when customer waits longer than expected', 'updates', 0, 'Thank you for your patience, {customer_name}. We apologize for the delay and appreciate your understanding.'),
('Joined Waitlist', 'Confirmation when customer joins waitlist', 'marketing', 0, 'Hi {customer_name}, you have been added to our waitlist for {service_name}. We will notify you when a slot becomes available.'),
('Waitlist Slot Available', 'Notification when waitlist slot becomes available', 'marketing', 0, 'Good news {customer_name}! A slot for {service_name} is now available. Would you like to book it?'),
('Birthday Wishes', 'Birthday message to customers', 'marketing', 0, 'Happy Birthday {customer_name}! Treat yourself to one of our services. Contact us to book your special day appointment.'),
('Follow Up After Visit', 'Follow up message after service', 'marketing', 168, 'Hi {customer_name}, it has been a week since your last {service_name}. How are you feeling? Book your next appointment with us!');

-- Enable RLS
ALTER TABLE public.reminder_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_message_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminder_configurations
CREATE POLICY "Users can view their tenant reminder configs" 
  ON public.reminder_configurations 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = reminder_configurations.tenant_id 
    AND ut.is_active = true
  ));

CREATE POLICY "Users can insert their tenant reminder configs" 
  ON public.reminder_configurations 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = reminder_configurations.tenant_id 
    AND ut.is_active = true
  ));

CREATE POLICY "Users can update their tenant reminder configs" 
  ON public.reminder_configurations 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = reminder_configurations.tenant_id 
    AND ut.is_active = true
  ));

-- Create RLS policies for automated_message_types (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view message types" 
  ON public.automated_message_types 
  FOR SELECT 
  TO authenticated 
  USING (true);

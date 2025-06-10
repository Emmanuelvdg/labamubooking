
-- Create waitlist entries table
CREATE TABLE public.waitlist_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  service_id UUID NOT NULL,
  preferred_staff_id UUID,
  queue_position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'served', 'cancelled', 'no_show')),
  estimated_wait_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  called_at TIMESTAMP WITH TIME ZONE,
  served_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create waitlist notifications table
CREATE TABLE public.waitlist_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  waitlist_entry_id UUID NOT NULL REFERENCES public.waitlist_entries(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('position_update', 'ready_soon', 'ready_now', 'cancelled')),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'app')),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for waitlist_entries
CREATE POLICY "Users can view their tenant waitlist entries" 
  ON public.waitlist_entries 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = waitlist_entries.tenant_id 
    AND ut.is_active = true
  ));

CREATE POLICY "Users can insert their tenant waitlist entries" 
  ON public.waitlist_entries 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = waitlist_entries.tenant_id 
    AND ut.is_active = true
  ));

CREATE POLICY "Users can update their tenant waitlist entries" 
  ON public.waitlist_entries 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.user_tenants ut 
    WHERE ut.user_id = auth.uid() 
    AND ut.tenant_id = waitlist_entries.tenant_id 
    AND ut.is_active = true
  ));

-- Create RLS policies for waitlist_notifications
CREATE POLICY "Users can view their tenant waitlist notifications" 
  ON public.waitlist_notifications 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.waitlist_entries we
    JOIN public.user_tenants ut ON ut.tenant_id = we.tenant_id
    WHERE we.id = waitlist_notifications.waitlist_entry_id
    AND ut.user_id = auth.uid() 
    AND ut.is_active = true
  ));

CREATE POLICY "Users can insert their tenant waitlist notifications" 
  ON public.waitlist_notifications 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.waitlist_entries we
    JOIN public.user_tenants ut ON ut.tenant_id = we.tenant_id
    WHERE we.id = waitlist_notifications.waitlist_entry_id
    AND ut.user_id = auth.uid() 
    AND ut.is_active = true
  ));

-- Create function to automatically assign queue position
CREATE OR REPLACE FUNCTION assign_queue_position()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the next position in queue for this tenant and service
  SELECT COALESCE(MAX(queue_position), 0) + 1
  INTO NEW.queue_position
  FROM public.waitlist_entries
  WHERE tenant_id = NEW.tenant_id
    AND service_id = NEW.service_id
    AND status = 'waiting';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign queue position on insert
CREATE TRIGGER assign_queue_position_trigger
  BEFORE INSERT ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION assign_queue_position();

-- Create function to update queue positions when entry status changes
CREATE OR REPLACE FUNCTION update_queue_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed from waiting to something else, update positions
  IF OLD.status = 'waiting' AND NEW.status != 'waiting' THEN
    UPDATE public.waitlist_entries
    SET queue_position = queue_position - 1,
        updated_at = now()
    WHERE tenant_id = NEW.tenant_id
      AND service_id = NEW.service_id
      AND status = 'waiting'
      AND queue_position > OLD.queue_position;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update queue positions
CREATE TRIGGER update_queue_positions_trigger
  AFTER UPDATE ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_queue_positions();

-- Create indexes for better performance
CREATE INDEX idx_waitlist_entries_tenant_service_status ON public.waitlist_entries(tenant_id, service_id, status);
CREATE INDEX idx_waitlist_entries_queue_position ON public.waitlist_entries(queue_position) WHERE status = 'waiting';
CREATE INDEX idx_waitlist_notifications_entry_id ON public.waitlist_notifications(waitlist_entry_id);

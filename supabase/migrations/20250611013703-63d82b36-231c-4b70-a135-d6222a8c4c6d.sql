
-- Create addon integrations table
CREATE TABLE public.addon_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('google_reserve', 'facebook_booking', 'instagram_booking')),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  configuration JSONB NOT NULL DEFAULT '{}',
  api_credentials JSONB DEFAULT '{}',
  sync_settings JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, integration_type)
);

-- Add RLS policies
ALTER TABLE public.addon_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tenant's addon integrations"
  ON public.addon_integrations
  FOR SELECT
  USING (tenant_id = public.get_current_tenant_id());

CREATE POLICY "Users can manage their tenant's addon integrations"
  ON public.addon_integrations
  FOR ALL
  USING (tenant_id = public.get_current_tenant_id());

-- Create external bookings table for synced bookings
CREATE TABLE public.external_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('google_reserve', 'facebook_booking', 'instagram_booking')),
  external_booking_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  service_name TEXT NOT NULL,
  staff_name TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  external_data JSONB DEFAULT '{}',
  synced_booking_id UUID, -- Reference to local booking if created
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, integration_type, external_booking_id)
);

-- Add RLS policies for external bookings
ALTER TABLE public.external_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tenant's external bookings"
  ON public.external_bookings
  FOR SELECT
  USING (tenant_id = public.get_current_tenant_id());

CREATE POLICY "Users can manage their tenant's external bookings"
  ON public.external_bookings
  FOR ALL
  USING (tenant_id = public.get_current_tenant_id());

-- Create sync logs table for tracking integration activities
CREATE TABLE public.integration_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_type TEXT NOT NULL,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('import', 'export', 'update', 'delete')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for sync logs
ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tenant's sync logs"
  ON public.integration_sync_logs
  FOR SELECT
  USING (tenant_id = public.get_current_tenant_id());

CREATE POLICY "Users can create sync logs for their tenant"
  ON public.integration_sync_logs
  FOR INSERT
  WITH CHECK (tenant_id = public.get_current_tenant_id());

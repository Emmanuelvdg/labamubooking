
-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');

-- Create public_business_profiles table
CREATE TABLE public.public_business_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  logo_url text,
  cover_image_url text,
  contact_email text,
  contact_phone text,
  address text,
  business_hours jsonb DEFAULT '{}',
  social_links jsonb DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create booking_settings table
CREATE TABLE public.booking_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  advance_booking_days integer DEFAULT 30,
  min_advance_hours integer DEFAULT 2,
  max_advance_hours integer DEFAULT 720,
  allow_same_day_booking boolean DEFAULT true,
  require_customer_phone boolean DEFAULT false,
  require_customer_notes boolean DEFAULT false,
  auto_confirm_bookings boolean DEFAULT false,
  send_confirmation_email boolean DEFAULT true,
  send_reminder_email boolean DEFAULT true,
  reminder_hours_before integer DEFAULT 24,
  cancellation_policy text,
  terms_and_conditions text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create public_staff_profiles table
CREATE TABLE public.public_staff_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  profile_image_url text,
  specialties text[] DEFAULT '{}',
  years_experience integer,
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create public_service_profiles table
CREATE TABLE public.public_service_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  description text,
  image_url text,
  features text[] DEFAULT '{}',
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  online_booking_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create online_bookings table
CREATE TABLE public.online_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  service_id uuid NOT NULL REFERENCES services(id),
  staff_id uuid NOT NULL REFERENCES staff(id),
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  customer_notes text,
  internal_notes text,
  confirmation_token text UNIQUE DEFAULT gen_random_uuid()::text,
  cancellation_token text UNIQUE DEFAULT gen_random_uuid()::text,
  total_price numeric,
  booking_reference text UNIQUE,
  source text DEFAULT 'online',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create availability_slots table for pre-computed availability
CREATE TABLE public.availability_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  is_booked boolean NOT NULL DEFAULT false,
  booking_id uuid REFERENCES online_bookings(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_public_business_profiles_slug ON public_business_profiles(slug);
CREATE INDEX idx_public_business_profiles_tenant_id ON public_business_profiles(tenant_id);
CREATE INDEX idx_booking_settings_tenant_id ON booking_settings(tenant_id);
CREATE INDEX idx_public_staff_profiles_tenant_id ON public_staff_profiles(tenant_id);
CREATE INDEX idx_public_staff_profiles_staff_id ON public_staff_profiles(staff_id);
CREATE INDEX idx_public_service_profiles_tenant_id ON public_service_profiles(tenant_id);
CREATE INDEX idx_public_service_profiles_service_id ON public_service_profiles(service_id);
CREATE INDEX idx_online_bookings_tenant_id ON online_bookings(tenant_id);
CREATE INDEX idx_online_bookings_start_time ON online_bookings(start_time);
CREATE INDEX idx_online_bookings_status ON online_bookings(status);
CREATE INDEX idx_availability_slots_tenant_staff_service ON availability_slots(tenant_id, staff_id, service_id);
CREATE INDEX idx_availability_slots_start_time ON availability_slots(start_time);

-- Enable RLS on all tables
ALTER TABLE public.public_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_service_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public business profiles (public read access)
CREATE POLICY "Public business profiles are publicly readable" 
  ON public.public_business_profiles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Business owners can manage their public profiles" 
  ON public.public_business_profiles 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create RLS policies for booking settings
CREATE POLICY "Booking settings are publicly readable" 
  ON public.booking_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Business owners can manage booking settings" 
  ON public.booking_settings 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create RLS policies for public staff profiles
CREATE POLICY "Public staff profiles are publicly readable" 
  ON public.public_staff_profiles 
  FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Business owners can manage staff public profiles" 
  ON public.public_staff_profiles 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create RLS policies for public service profiles
CREATE POLICY "Public service profiles are publicly readable" 
  ON public.public_service_profiles 
  FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Business owners can manage service public profiles" 
  ON public.public_service_profiles 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create RLS policies for online bookings
CREATE POLICY "Customers can create online bookings" 
  ON public.online_bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Business owners can view and manage their bookings" 
  ON public.online_bookings 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create RLS policies for availability slots
CREATE POLICY "Availability slots are publicly readable" 
  ON public.availability_slots 
  FOR SELECT 
  USING (is_available = true);

CREATE POLICY "Business owners can manage availability slots" 
  ON public.availability_slots 
  FOR ALL 
  USING (public.user_belongs_to_tenant(tenant_id));

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_reference
  BEFORE INSERT ON public.online_bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_online_booking_conflicts(
  p_tenant_id uuid,
  p_staff_id uuid,
  p_start_time timestamp with time zone,
  p_end_time timestamp with time zone,
  p_exclude_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.online_bookings
    WHERE tenant_id = p_tenant_id
      AND staff_id = p_staff_id
      AND status NOT IN ('cancelled', 'no_show')
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND (
        (p_start_time >= start_time AND p_start_time < end_time) OR
        (p_end_time > start_time AND p_end_time <= end_time) OR
        (p_start_time <= start_time AND p_end_time >= end_time)
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

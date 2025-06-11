
-- Enable RLS on booking_settings table if not already enabled
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to booking settings
-- This is needed for the public booking page to display policies and rules
CREATE POLICY "Allow public read access to booking settings" 
  ON public.booking_settings 
  FOR SELECT 
  USING (true);

-- Also need to enable public access to public_staff_profiles for the booking form
ALTER TABLE public.public_staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to public staff profiles" 
  ON public.public_staff_profiles 
  FOR SELECT 
  USING (is_visible = true);

-- Enable public access to public_service_profiles for the booking form  
ALTER TABLE public.public_service_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to public service profiles" 
  ON public.public_service_profiles 
  FOR SELECT 
  USING (is_visible = true AND online_booking_enabled = true);

-- Enable public access to services table for service details
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to services" 
  ON public.services 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.public_service_profiles psp 
      WHERE psp.service_id = services.id 
      AND psp.is_visible = true 
      AND psp.online_booking_enabled = true
    )
  );

-- Enable public access to staff table for staff details
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to staff" 
  ON public.staff 
  FOR SELECT 
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.public_staff_profiles psp 
      WHERE psp.staff_id = staff.id 
      AND psp.is_visible = true
    )
  );

-- Enable public access to availability_slots for booking
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to availability slots" 
  ON public.availability_slots 
  FOR SELECT 
  USING (is_available = true AND is_booked = false);


-- Create RLS policies for public_business_profiles table
ALTER TABLE public.public_business_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing public business profiles (anyone can view active profiles)
CREATE POLICY "Anyone can view active business profiles" ON public.public_business_profiles
FOR SELECT USING (is_active = true);

-- Policy for tenant owners/admins to manage their own business profiles
CREATE POLICY "Tenant users can manage their business profiles" ON public.public_business_profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = public_business_profiles.tenant_id
      AND ut.is_active = true
  )
);

-- Create RLS policies for public_staff_profiles table
ALTER TABLE public.public_staff_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing public staff profiles (anyone can view visible profiles)
CREATE POLICY "Anyone can view visible staff profiles" ON public.public_staff_profiles
FOR SELECT USING (is_visible = true);

-- Policy for tenant users to manage their staff profiles
CREATE POLICY "Tenant users can manage their staff profiles" ON public.public_staff_profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = public_staff_profiles.tenant_id
      AND ut.is_active = true
  )
);

-- Create RLS policies for public_service_profiles table
ALTER TABLE public.public_service_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing public service profiles (anyone can view visible profiles)
CREATE POLICY "Anyone can view visible service profiles" ON public.public_service_profiles
FOR SELECT USING (is_visible = true);

-- Policy for tenant users to manage their service profiles
CREATE POLICY "Tenant users can manage their service profiles" ON public.public_service_profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = public_service_profiles.tenant_id
      AND ut.is_active = true
  )
);

-- Create RLS policies for booking_settings table
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Policy for tenant users to manage their booking settings
CREATE POLICY "Tenant users can manage their booking settings" ON public.booking_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = booking_settings.tenant_id
      AND ut.is_active = true
  )
);

-- Add unique constraint for business profile slugs
ALTER TABLE public.public_business_profiles 
ADD CONSTRAINT public_business_profiles_slug_unique UNIQUE (slug);

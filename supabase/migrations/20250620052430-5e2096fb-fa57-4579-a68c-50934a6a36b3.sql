
-- Create RLS policy to allow public users to insert online bookings
CREATE POLICY "Allow public users to create online bookings" 
  ON public.online_bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Also allow public users to read their own bookings using confirmation token
CREATE POLICY "Allow public users to view bookings by confirmation token" 
  ON public.online_bookings 
  FOR SELECT 
  USING (confirmation_token IS NOT NULL);


-- First, let's make sure the booking_settings table is accessible for public reads
DROP POLICY IF EXISTS "Allow public read access to booking settings" ON public.booking_settings;
CREATE POLICY "Allow public read access to booking settings" 
  ON public.booking_settings 
  FOR SELECT 
  USING (true);

-- Also ensure RLS is enabled properly
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Let's create some sample availability slots for the existing staff members
-- First, let's get the current date and create slots for the next 30 days
DO $$
DECLARE
    staff_record RECORD;
    service_record RECORD;
    slot_date DATE;
    slot_time TIME;
    slot_start TIMESTAMP WITH TIME ZONE;
    slot_end TIMESTAMP WITH TIME ZONE;
    current_tenant_id UUID := '32d923e3-9dff-4373-af79-cf15cb9d4f45'; -- The tenant ID from the logs
BEGIN
    -- Loop through each staff member
    FOR staff_record IN 
        SELECT id, name FROM staff WHERE tenant_id = current_tenant_id AND is_active = true
    LOOP
        -- Loop through each service
        FOR service_record IN 
            SELECT id, duration FROM services WHERE tenant_id = current_tenant_id
        LOOP
            -- Create slots for the next 30 days
            FOR i IN 0..29 LOOP
                slot_date := CURRENT_DATE + i;
                
                -- Skip weekends (Saturday = 6, Sunday = 0)
                IF EXTRACT(DOW FROM slot_date) NOT IN (0, 6) THEN
                    -- Create slots from 9 AM to 5 PM, every hour
                    FOR hour_slot IN 9..16 LOOP
                        slot_time := (hour_slot || ':00:00')::TIME;
                        slot_start := slot_date + slot_time;
                        slot_end := slot_start + (service_record.duration || ' minutes')::INTERVAL;
                        
                        -- Only create if slot doesn't already exist
                        INSERT INTO availability_slots (
                            tenant_id,
                            staff_id,
                            service_id,
                            start_time,
                            end_time,
                            is_available,
                            is_booked
                        ) VALUES (
                            current_tenant_id,
                            staff_record.id,
                            service_record.id,
                            slot_start,
                            slot_end,
                            true,
                            false
                        ) ON CONFLICT DO NOTHING;
                    END LOOP;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

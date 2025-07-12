-- Fix duplicate booking settings by keeping the latest one and removing duplicates
DELETE FROM booking_settings 
WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6' 
AND id NOT IN (
  SELECT id FROM booking_settings 
  WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6' 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Clear existing availability slots to regenerate them correctly  
DELETE FROM availability_slots WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6';

-- Regenerate availability slots based on staff schedules for the next 7 days
-- This will fix the schedule alignment issue
DO $$
DECLARE
    start_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '7 days';
    staff_rec RECORD;
    service_rec RECORD;
    schedule_rec RECORD;
    schedule_instance RECORD;
    slot_start TIMESTAMP WITH TIME ZONE;
    slot_end TIMESTAMP WITH TIME ZONE;
    slot_time TIMESTAMP WITH TIME ZONE;
    schedule_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get all staff for the tenant
    FOR staff_rec IN 
        SELECT id FROM staff 
        WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6' 
        AND is_active = true
    LOOP
        -- Get all services for the tenant
        FOR service_rec IN 
            SELECT id, duration FROM services 
            WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6'
        LOOP
            -- Get all schedules for this staff member
            FOR schedule_rec IN
                SELECT id FROM staff_schedules 
                WHERE staff_id = staff_rec.id 
                AND tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6'
            LOOP
                -- Get schedule instances for this schedule for the date range
                FOR schedule_instance IN
                    SELECT * FROM generate_schedule_instances(
                        schedule_rec.id,
                        start_date,
                        end_date
                    )
                LOOP
                    -- Generate slots during the scheduled work hours
                    slot_time := schedule_instance.start_time;
                    schedule_end := schedule_instance.end_time;
                    
                    -- Create slots in service duration intervals during work hours
                    WHILE slot_time + (service_rec.duration || ' minutes')::INTERVAL <= schedule_end LOOP
                        slot_start := slot_time;
                        slot_end := slot_time + (service_rec.duration || ' minutes')::INTERVAL;
                        
                        -- Only create slot if it doesn't already exist
                        IF NOT EXISTS (
                            SELECT 1 FROM availability_slots 
                            WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6'
                            AND staff_id = staff_rec.id
                            AND service_id = service_rec.id
                            AND start_time = slot_start
                        ) THEN
                            INSERT INTO availability_slots (
                                tenant_id,
                                staff_id,
                                service_id,
                                start_time,
                                end_time,
                                is_available,
                                is_booked
                            ) VALUES (
                                '736487fd-c47c-4bbc-af42-976d046362f6',
                                staff_rec.id,
                                service_rec.id,
                                slot_start,
                                slot_end,
                                true,
                                false
                            );
                        END IF;
                        
                        -- Move to next slot (15-minute intervals for better granularity)
                        slot_time := slot_time + INTERVAL '15 minutes';
                    END LOOP;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
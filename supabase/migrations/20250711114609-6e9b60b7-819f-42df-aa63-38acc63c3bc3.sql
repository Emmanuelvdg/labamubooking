-- Create availability slots for the next 7 days for the current tenant
-- This will generate slots from 9 AM to 5 PM in 1-hour intervals

DO $$
DECLARE
    start_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '7 days';
    current_day DATE;
    staff_rec RECORD;
    service_rec RECORD;
    slot_start TIMESTAMP WITH TIME ZONE;
    slot_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get staff and services for tenant 736487fd-c47c-4bbc-af42-976d046362f6
    FOR staff_rec IN 
        SELECT id FROM staff 
        WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6' 
        AND is_active = true
    LOOP
        FOR service_rec IN 
            SELECT id, duration FROM services 
            WHERE tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6'
        LOOP
            -- Generate slots for each day
            current_day := start_date;
            WHILE current_day <= end_date LOOP
                -- Skip weekends for now
                IF EXTRACT(DOW FROM current_day) NOT IN (0, 6) THEN
                    -- Generate hourly slots from 9 AM to 5 PM
                    FOR i IN 9..16 LOOP
                        slot_start := current_day + (i || ' hours')::INTERVAL;
                        slot_end := slot_start + (service_rec.duration || ' minutes')::INTERVAL;
                        
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
                    END LOOP;
                END IF;
                current_day := current_day + INTERVAL '1 day';
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
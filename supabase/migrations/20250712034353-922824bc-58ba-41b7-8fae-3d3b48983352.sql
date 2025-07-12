-- Create availability slots based on staff schedules for the next 7 days
-- This will generate slots during actual scheduled work hours

DO $$
DECLARE
    start_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '7 days';
    staff_rec RECORD;
    service_rec RECORD;
    schedule_instance RECORD;
    slot_start TIMESTAMP WITH TIME ZONE;
    slot_end TIMESTAMP WITH TIME ZONE;
    current_time TIMESTAMP WITH TIME ZONE;
    schedule_end TIMESTAMP WITH TIME ZONE;
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
            -- Get schedule instances for this staff member for the date range
            FOR schedule_instance IN
                SELECT * FROM generate_schedule_instances(
                    (SELECT s.id FROM staff_schedules s WHERE s.staff_id = staff_rec.id AND s.tenant_id = '736487fd-c47c-4bbc-af42-976d046362f6' LIMIT 1),
                    start_date,
                    end_date
                )
            LOOP
                -- Generate slots during the scheduled work hours
                current_time := schedule_instance.start_time;
                schedule_end := schedule_instance.end_time;
                
                -- Create slots in service duration intervals during work hours
                WHILE current_time + (service_rec.duration || ' minutes')::INTERVAL <= schedule_end LOOP
                    slot_start := current_time;
                    slot_end := current_time + (service_rec.duration || ' minutes')::INTERVAL;
                    
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
                    
                    -- Move to next slot (can be 15 min, 30 min, or hour intervals)
                    current_time := current_time + INTERVAL '30 minutes';
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
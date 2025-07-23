-- Create a function to get all working time periods (schedules + roster assignments) for a staff member
CREATE OR REPLACE FUNCTION public.get_staff_working_periods(
  p_staff_id UUID,
  p_tenant_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(
  source_type TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  title TEXT,
  description TEXT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  -- Return schedule instances
  RETURN QUERY
  SELECT 
    'schedule'::TEXT as source_type,
    si.start_time,
    si.end_time,
    si.title,
    si.description
  FROM staff_schedules ss,
       LATERAL generate_schedule_instances(ss.id, p_start_date, p_end_date) si
  WHERE ss.staff_id = p_staff_id 
    AND ss.tenant_id = p_tenant_id;
  
  -- Return roster assignments
  RETURN QUERY
  SELECT 
    'roster'::TEXT as source_type,
    ra.start_time,
    ra.end_time,
    COALESCE(ra.notes, 'Roster Assignment')::TEXT as title,
    ra.notes as description
  FROM roster_assignments ra
  WHERE ra.staff_id = p_staff_id
    AND ra.tenant_id = p_tenant_id
    AND ra.status IN ('scheduled', 'confirmed')
    AND ra.start_time::DATE BETWEEN p_start_date AND p_end_date;
END;
$$;

-- Create a function to generate availability slots from all working periods
CREATE OR REPLACE FUNCTION public.generate_availability_slots_comprehensive(
  p_tenant_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  staff_rec RECORD;
  service_rec RECORD;
  working_period RECORD;
  slot_start TIMESTAMP WITH TIME ZONE;
  slot_end TIMESTAMP WITH TIME ZONE;
  slot_time TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
  slots_created INTEGER := 0;
BEGIN
  -- Clear existing slots for the date range and tenant
  DELETE FROM availability_slots 
  WHERE tenant_id = p_tenant_id
    AND start_time::DATE BETWEEN p_start_date AND p_end_date;
  
  -- Get all active staff for the tenant
  FOR staff_rec IN 
    SELECT id FROM staff 
    WHERE tenant_id = p_tenant_id 
    AND is_active = true
  LOOP
    -- Get all services for the tenant
    FOR service_rec IN 
      SELECT id, duration FROM services 
      WHERE tenant_id = p_tenant_id
    LOOP
      -- Get all working periods (schedules + roster assignments) for this staff member
      FOR working_period IN
        SELECT * FROM get_staff_working_periods(
          staff_rec.id,
          p_tenant_id,
          p_start_date,
          p_end_date
        )
      LOOP
        -- Generate slots during the working period
        slot_time := working_period.start_time;
        period_end := working_period.end_time;
        
        -- Create slots in 15-minute intervals during working hours
        WHILE slot_time + (service_rec.duration || ' minutes')::INTERVAL <= period_end LOOP
          slot_start := slot_time;
          slot_end := slot_time + (service_rec.duration || ' minutes')::INTERVAL;
          
          -- Only create slot if it doesn't already exist (avoid duplicates from overlapping periods)
          IF NOT EXISTS (
            SELECT 1 FROM availability_slots 
            WHERE tenant_id = p_tenant_id
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
              p_tenant_id,
              staff_rec.id,
              service_rec.id,
              slot_start,
              slot_end,
              true,
              false
            );
            slots_created := slots_created + 1;
          END IF;
          
          -- Move to next slot (15-minute intervals)
          slot_time := slot_time + INTERVAL '15 minutes';
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
  
  RETURN slots_created;
END;
$$;

-- Now regenerate all availability slots using the new comprehensive function
SELECT generate_availability_slots_comprehensive(
  '736487fd-c47c-4bbc-af42-976d046362f6'::UUID,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '7 days'
) as slots_created;
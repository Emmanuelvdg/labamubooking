-- Create triggers to automatically regenerate availability slots when roster assignments change
CREATE OR REPLACE FUNCTION public.refresh_availability_slots_on_roster_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_date DATE;
  start_date DATE;
  end_date DATE;
BEGIN
  -- Determine the date range to refresh based on the roster assignment
  IF TG_OP = 'DELETE' THEN
    affected_date := OLD.start_time::DATE;
  ELSE
    affected_date := NEW.start_time::DATE;
  END IF;
  
  -- Refresh a wider range (7 days from the affected date) to handle any dependencies
  start_date := affected_date;
  end_date := affected_date + INTERVAL '7 days';
  
  -- Regenerate availability slots for the affected tenant and date range
  IF TG_OP = 'DELETE' THEN
    PERFORM generate_availability_slots_comprehensive(OLD.tenant_id, start_date, end_date);
  ELSE
    PERFORM generate_availability_slots_comprehensive(NEW.tenant_id, start_date, end_date);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for roster assignment changes
DROP TRIGGER IF EXISTS trigger_refresh_slots_on_roster_change ON roster_assignments;
CREATE TRIGGER trigger_refresh_slots_on_roster_change
  AFTER INSERT OR UPDATE OR DELETE ON roster_assignments
  FOR EACH ROW
  EXECUTE FUNCTION refresh_availability_slots_on_roster_change();

-- Create some current roster assignments for testing
INSERT INTO roster_assignments (
  tenant_id,
  staff_id,
  start_time,
  end_time,
  status,
  assignment_type,
  notes
) VALUES 
(
  '736487fd-c47c-4bbc-af42-976d046362f6',
  'e7c25086-7a35-4318-8ba4-a2eb5df54476', -- Terry
  CURRENT_DATE + INTERVAL '9 hours',
  CURRENT_DATE + INTERVAL '17 hours',
  'scheduled',
  'regular',
  'Daily shift today'
),
(
  '736487fd-c47c-4bbc-af42-976d046362f6',
  'e7c25086-7a35-4318-8ba4-a2eb5df54476', -- Terry
  (CURRENT_DATE + INTERVAL '1 day') + INTERVAL '9 hours',
  (CURRENT_DATE + INTERVAL '1 day') + INTERVAL '17 hours',
  'scheduled',
  'regular',
  'Daily shift tomorrow'
),
(
  '736487fd-c47c-4bbc-af42-976d046362f6',
  'a78562d2-6fa1-4ce4-be45-2f8f4372f924', -- Susan
  CURRENT_DATE + INTERVAL '10 hours',
  CURRENT_DATE + INTERVAL '16 hours',
  'scheduled',
  'regular',
  'Susan shift today'
);
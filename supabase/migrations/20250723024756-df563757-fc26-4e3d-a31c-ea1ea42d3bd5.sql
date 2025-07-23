-- Fix the return type mismatch in get_staff_working_periods
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
    si.title::TEXT,  -- Cast varchar to text
    si.description::TEXT  -- Cast to text
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
    ra.notes::TEXT as description
  FROM roster_assignments ra
  WHERE ra.staff_id = p_staff_id
    AND ra.tenant_id = p_tenant_id
    AND ra.status IN ('scheduled', 'confirmed')
    AND ra.start_time::DATE BETWEEN p_start_date AND p_end_date;
END;
$$;
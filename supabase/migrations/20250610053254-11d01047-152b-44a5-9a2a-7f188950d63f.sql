
-- Drop the existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS assign_queue_position_trigger ON public.waitlist_entries;
DROP FUNCTION IF EXISTS assign_queue_position();

-- Create improved function to automatically assign queue position
CREATE OR REPLACE FUNCTION assign_queue_position()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign position if not already set and status is 'waiting'
  IF NEW.queue_position IS NULL AND NEW.status = 'waiting' THEN
    -- Get the next position in queue for this tenant and service
    SELECT COALESCE(MAX(queue_position), 0) + 1
    INTO NEW.queue_position
    FROM public.waitlist_entries
    WHERE tenant_id = NEW.tenant_id
      AND service_id = NEW.service_id
      AND status = 'waiting';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign queue position on insert
CREATE TRIGGER assign_queue_position_trigger
  BEFORE INSERT ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION assign_queue_position();

-- Update the existing update_queue_positions function to be more robust
DROP TRIGGER IF EXISTS update_queue_positions_trigger ON public.waitlist_entries;
DROP FUNCTION IF EXISTS update_queue_positions();

CREATE OR REPLACE FUNCTION update_queue_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed from waiting to something else, update positions
  IF OLD.status = 'waiting' AND NEW.status != 'waiting' THEN
    UPDATE public.waitlist_entries
    SET queue_position = queue_position - 1,
        updated_at = now()
    WHERE tenant_id = NEW.tenant_id
      AND service_id = NEW.service_id
      AND status = 'waiting'
      AND queue_position > OLD.queue_position;
  END IF;
  
  -- If status changed from non-waiting to waiting, assign new position
  IF OLD.status != 'waiting' AND NEW.status = 'waiting' AND NEW.queue_position IS NULL THEN
    SELECT COALESCE(MAX(queue_position), 0) + 1
    INTO NEW.queue_position
    FROM public.waitlist_entries
    WHERE tenant_id = NEW.tenant_id
      AND service_id = NEW.service_id
      AND status = 'waiting'
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update queue positions
CREATE TRIGGER update_queue_positions_trigger
  AFTER UPDATE ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_queue_positions();

-- Make queue_position have a default value to work with the trigger
ALTER TABLE public.waitlist_entries 
ALTER COLUMN queue_position SET DEFAULT 1;

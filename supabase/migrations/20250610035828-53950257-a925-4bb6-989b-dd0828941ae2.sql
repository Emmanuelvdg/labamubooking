
-- Add birth_date column to customers table to support birthday wishes
ALTER TABLE public.customers 
ADD COLUMN birth_date DATE;

-- Add a comment to explain the column
COMMENT ON COLUMN public.customers.birth_date IS 'Customer birth date for birthday wishes and age-based marketing';

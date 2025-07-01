
-- Update existing timeline events to use new date format
UPDATE timeline_events 
SET date = CASE 
  WHEN date ~ '^Year \d+, Day \d+$' THEN 
    REPLACE(REPLACE(date, 'Year ', ''), ', Day ', ', Month 1, Day ')
  WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN 
    'Year ' || EXTRACT(YEAR FROM date::date) || ', Month ' || EXTRACT(MONTH FROM date::date) || ', Day ' || EXTRACT(DAY FROM date::date)
  ELSE date
END
WHERE date IS NOT NULL;

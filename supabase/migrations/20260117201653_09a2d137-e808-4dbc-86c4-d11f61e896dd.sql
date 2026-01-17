-- Add new columns for origin, size, and weight to animals table
ALTER TABLE public.animals 
ADD COLUMN ursprung text,
ADD COLUMN storlek text,
ADD COLUMN vikt text;
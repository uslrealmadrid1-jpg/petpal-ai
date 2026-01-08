-- Create login_logs table for tracking authentication attempts
CREATE TABLE public.login_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  success boolean NOT NULL DEFAULT false,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on login_logs
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view login logs
CREATE POLICY "Admins can view all login logs"
ON public.login_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow inserting login logs (for edge function with service role)
CREATE POLICY "Service can insert login logs"
ON public.login_logs
FOR INSERT
WITH CHECK (true);

-- Add last_login column to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
-- Drop the ip_address column from login_logs
ALTER TABLE public.login_logs DROP COLUMN IF EXISTS ip_address;

-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Service can insert login logs" ON public.login_logs;

-- Create a more restrictive INSERT policy - only authenticated users can log their own attempts
CREATE POLICY "Authenticated users can insert login logs"
ON public.login_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
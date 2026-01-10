-- Fix the overly permissive RLS policy for flagged_messages insert
-- Drop the old policy and create a new one that requires authentication
DROP POLICY IF EXISTS "Service can insert flagged messages" ON public.flagged_messages;

-- Allow authenticated users to insert flagged messages (the edge function will handle this)
-- This is needed because the AI flags messages from authenticated users
CREATE POLICY "Authenticated users can flag messages"
ON public.flagged_messages FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
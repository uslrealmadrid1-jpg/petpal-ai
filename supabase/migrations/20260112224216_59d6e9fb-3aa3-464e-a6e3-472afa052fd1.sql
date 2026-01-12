-- Fix: Ensure users can only view their own flagged messages, admins can see all
-- First drop existing policy that might cause issues
DROP POLICY IF EXISTS "Users can view their own flagged messages" ON flagged_messages;

-- Add policy so users can only view their own flagged messages
CREATE POLICY "Users can view their own flagged messages"
ON flagged_messages
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
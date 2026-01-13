-- Fix: Remove the ability for users to view their own flagged messages (only admins should see)
DROP POLICY IF EXISTS "Users can view their own flagged messages" ON flagged_messages;

-- Fix: Restrict login log INSERT to only work for the current user (prevent spoofing)
DROP POLICY IF EXISTS "Authenticated users can insert login logs" ON login_logs;
CREATE POLICY "Users can only insert their own login logs"
ON login_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Add policy so users can view their own login history
CREATE POLICY "Users can view their own login logs"
ON login_logs
FOR SELECT
USING (auth.uid() = user_id);
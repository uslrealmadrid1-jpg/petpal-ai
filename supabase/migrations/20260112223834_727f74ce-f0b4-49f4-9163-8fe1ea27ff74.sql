-- Add admin policy to view all chat history
CREATE POLICY "Admin can view all chat history"
ON ai_chat_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update policy for users
CREATE POLICY "Users can update own chat history"
ON ai_chat_history
FOR UPDATE
USING (auth.uid() = user_id);

-- Add delete policy for users
CREATE POLICY "Users can delete own chat history"
ON ai_chat_history
FOR DELETE
USING (auth.uid() = user_id);
-- Create user_violations table for tracking blocked users
CREATE TABLE public.user_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  is_blocked boolean DEFAULT false,
  blocked_reason text,
  blocked_at timestamp with time zone,
  unblocked_at timestamp with time zone,
  unblocked_by_admin boolean DEFAULT false,
  violation_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create admin_actions table for logging all admin actions
CREATE TABLE public.admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('block', 'unblock', 'flag_reviewed')),
  reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create flagged_messages table for AI-flagged rule violations
CREATE TABLE public.flagged_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message_content text NOT NULL,
  flag_reason text NOT NULL,
  is_reviewed boolean DEFAULT false,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_violations
CREATE POLICY "Users can view their own violation status"
ON public.user_violations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all violations"
ON public.user_violations FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert violations"
ON public.user_violations FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update violations"
ON public.user_violations FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for admin_actions (only admins)
CREATE POLICY "Admins can view admin actions"
ON public.admin_actions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert admin actions"
ON public.admin_actions FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for flagged_messages
CREATE POLICY "Admins can view flagged messages"
ON public.flagged_messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can insert flagged messages"
ON public.flagged_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update flagged messages"
ON public.flagged_messages FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_user_violations_user_id ON public.user_violations(user_id);
CREATE INDEX idx_user_violations_is_blocked ON public.user_violations(is_blocked);
CREATE INDEX idx_flagged_messages_user_id ON public.flagged_messages(user_id);
CREATE INDEX idx_flagged_messages_is_reviewed ON public.flagged_messages(is_reviewed);
CREATE INDEX idx_admin_actions_target_user ON public.admin_actions(target_user_id);
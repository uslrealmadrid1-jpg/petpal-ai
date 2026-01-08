import { supabase } from "@/integrations/supabase/client";

interface LogLoginParams {
  email: string;
  success: boolean;
  userId?: string;
}

export async function logLoginAttempt({ email, success, userId }: LogLoginParams) {
  try {
    // Get user agent from browser
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
    
    await supabase.from("login_logs").insert({
      email,
      success,
      user_id: userId || null,
      user_agent: userAgent,
      ip_address: null, // Would need server-side to get real IP
    });
  } catch (error) {
    // Silently fail - don't block login flow
    console.error("Failed to log login attempt:", error);
  }
}

export async function updateLastLogin(userId: string) {
  try {
    await supabase
      .from("profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
}

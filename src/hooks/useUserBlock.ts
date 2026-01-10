import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserViolation {
  id: string;
  user_id: string;
  is_blocked: boolean;
  blocked_reason: string | null;
  blocked_at: string | null;
  violation_count: number;
}

export function useUserBlock() {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBlockStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_violations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking block status:", error);
        setIsLoading(false);
        return;
      }

      if (data && data.is_blocked) {
        setIsBlocked(true);
        setBlockReason(data.blocked_reason);
      } else {
        setIsBlocked(false);
        setBlockReason(null);
      }
      setIsLoading(false);
    };

    checkBlockStatus();
  }, [user]);

  return { isBlocked, blockReason, isLoading };
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Flag, 
  Lock, 
  Unlock, 
  Loader2, 
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";

interface FlaggedMessage {
  id: string;
  user_id: string;
  message_content: string;
  flag_reason: string;
  is_reviewed: boolean;
  created_at: string;
}

interface UserViolation {
  id: string;
  user_id: string;
  is_blocked: boolean;
  blocked_reason: string | null;
  blocked_at: string | null;
  unblocked_at: string | null;
  violation_count: number;
}

interface AdminAction {
  id: string;
  admin_user_id: string;
  target_user_id: string;
  action_type: string;
  reason: string | null;
  created_at: string;
}

export function ModerationTab() {
  const { user } = useAuth();
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [violations, setViolations] = useState<UserViolation[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "d MMM yyyy HH:mm", { locale: sv });
  };

  // Fetch all moderation data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch flagged messages (only unreviewed)
      const { data: messages } = await supabase
        .from("flagged_messages")
        .select("*")
        .eq("is_reviewed", false)
        .order("created_at", { ascending: false });

      // Fetch all violations
      const { data: viols } = await supabase
        .from("user_violations")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch admin actions
      const { data: actions } = await supabase
        .from("admin_actions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      setFlaggedMessages(messages || []);
      setViolations(viols || []);
      setAdminActions(actions || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Block a user
  const blockUser = async (userId: string, reason: string) => {
    if (!user) return;
    setProcessingUser(userId);

    try {
      // Check if violation record exists
      const { data: existing } = await supabase
        .from("user_violations")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        await supabase
          .from("user_violations")
          .update({
            is_blocked: true,
            blocked_reason: reason,
            blocked_at: new Date().toISOString(),
            violation_count: (existing.violation_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId);
      } else {
        // Create new record
        await supabase
          .from("user_violations")
          .insert({
            user_id: userId,
            is_blocked: true,
            blocked_reason: reason,
            blocked_at: new Date().toISOString(),
            violation_count: 1
          });
      }

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_user_id: user.id,
          target_user_id: userId,
          action_type: "block",
          reason: reason
        });

      toast.success("Användare blockerad");
      
      // Refresh data
      const { data: viols } = await supabase
        .from("user_violations")
        .select("*")
        .order("created_at", { ascending: false });
      setViolations(viols || []);

    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Kunde inte blockera användare");
    } finally {
      setProcessingUser(null);
    }
  };

  // Unblock a user
  const unblockUser = async (userId: string) => {
    if (!user) return;
    setProcessingUser(userId);

    try {
      await supabase
        .from("user_violations")
        .update({
          is_blocked: false,
          unblocked_at: new Date().toISOString(),
          unblocked_by_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_user_id: user.id,
          target_user_id: userId,
          action_type: "unblock",
          reason: "Manuellt avblockerad av admin"
        });

      toast.success("Användare avblockerad");
      
      // Refresh data
      const { data: viols } = await supabase
        .from("user_violations")
        .select("*")
        .order("created_at", { ascending: false });
      setViolations(viols || []);

    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Kunde inte avblockera användare");
    } finally {
      setProcessingUser(null);
    }
  };

  // Mark flagged message as reviewed
  const markAsReviewed = async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from("flagged_messages")
        .update({
          is_reviewed: true,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", messageId);

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_user_id: user.id,
          target_user_id: flaggedMessages.find(m => m.id === messageId)?.user_id || "",
          action_type: "flag_reviewed",
          reason: "Flaggat meddelande granskat"
        });

      toast.success("Markerad som granskad");
      setFlaggedMessages(prev => prev.filter(m => m.id !== messageId));

    } catch (error) {
      console.error("Error marking as reviewed:", error);
      toast.error("Kunde inte uppdatera");
    }
  };

  const blockedUsers = violations.filter(v => v.is_blocked);
  const totalViolations = violations.reduce((sum, v) => sum + (v.violation_count || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Flag className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{flaggedMessages.length}</p>
              <p className="text-xs text-muted-foreground">Nya flaggor</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{blockedUsers.length}</p>
              <p className="text-xs text-muted-foreground">Blockerade</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalViolations}</p>
              <p className="text-xs text-muted-foreground">Totala regelbrott</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{adminActions.length}</p>
              <p className="text-xs text-muted-foreground">Admin-åtgärder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Messages */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-amber-500/5">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-500" />
            Flaggade meddelanden
            {flaggedMessages.length > 0 && (
              <Badge variant="destructive" className="ml-2">{flaggedMessages.length}</Badge>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            AI-flaggade regelbrott (endast metadata visas, inga privata chattar)
          </p>
        </div>

        {flaggedMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
            <p>Inga nya flaggor 🎉</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {flaggedMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {msg.user_id.slice(0, 8)}...
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          {msg.flag_reason}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                        <MessageSquare className="w-4 h-4 inline mr-2 text-muted-foreground" />
                        {msg.message_content.slice(0, 200)}
                        {msg.message_content.length > 200 && "..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => blockUser(msg.user_id, msg.flag_reason)}
                        disabled={processingUser === msg.user_id}
                      >
                        {processingUser === msg.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Blockera
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReviewed(msg.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        OK
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked Users */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-destructive/5">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            Blockerade användare
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Endast admin kan avblockera
          </p>
        </div>

        {blockedUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Unlock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Inga blockerade användare</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {blockedUsers.map((violation) => (
              <div key={violation.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        {violation.user_id.slice(0, 8)}...
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        {violation.violation_count} regelbrott
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Anledning:</strong> {violation.blocked_reason || "Ingen angiven"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Blockerad: {formatDate(violation.blocked_at)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unblockUser(violation.user_id)}
                    disabled={processingUser === violation.user_id}
                    className="border-green-500/50 text-green-600 hover:bg-green-500/10"
                  >
                    {processingUser === violation.user_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-1" />
                        Avblockera
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Action Log */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Admin-logg
          </h2>
        </div>

        {adminActions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Inga admin-åtgärder loggade</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {adminActions.map((action) => (
              <div key={action.id} className="p-3 text-sm">
                <div className="flex items-center gap-2">
                  {action.action_type === "block" && <Lock className="w-4 h-4 text-destructive" />}
                  {action.action_type === "unblock" && <Unlock className="w-4 h-4 text-green-500" />}
                  {action.action_type === "flag_reviewed" && <Eye className="w-4 h-4 text-primary" />}
                  <span className="font-medium">
                    {action.action_type === "block" && "Blockerade"}
                    {action.action_type === "unblock" && "Avblockerade"}
                    {action.action_type === "flag_reviewed" && "Granskade flagga för"}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {action.target_user_id.slice(0, 8)}...
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(action.created_at)}
                  {action.reason && ` — ${action.reason}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

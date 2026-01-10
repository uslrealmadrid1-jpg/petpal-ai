import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Clock, 
  Mail, 
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Flag,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ModerationTab } from "@/components/admin/ModerationTab";
import { SettingsTab } from "@/components/SettingsTab";

interface UserProfile {
  id: string;
  display_name: string | null;
  created_at: string;
  last_login: string | null;
}

interface LoginLog {
  id: string;
  email: string;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "moderation" | "settings">("users");

  // Redirect if not admin - only redirect after auth check is complete AND roles are loaded
  // We need to wait a bit for roles to be fetched since they're loaded async after user is set
  const [rolesChecked, setRolesChecked] = useState(false);
  
  useEffect(() => {
    if (!authLoading && user) {
      // Give time for roles to be fetched (they're loaded async after auth)
      const timer = setTimeout(() => {
        setRolesChecked(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!authLoading && !user) {
      // No user, redirect immediately
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);
  
  useEffect(() => {
    if (rolesChecked && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [rolesChecked, isAdmin, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      setIsLoadingUsers(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, created_at, last_login")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
      setIsLoadingUsers(false);
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Fetch login logs
  useEffect(() => {
    const fetchLogs = async () => {
      if (!isAdmin) return;

      setIsLoadingLogs(true);
      const { data, error } = await supabase
        .from("login_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching login logs:", error);
      } else {
        setLoginLogs(data || []);
      }
      setIsLoadingLogs(false);
    };

    if (isAdmin) {
      fetchLogs();
    }
  }, [isAdmin]);

  // Show loading while auth is loading or roles haven't been checked yet
  if (authLoading || (user && !rolesChecked)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "d MMM yyyy HH:mm", { locale: sv });
  };

  const successfulLogins = loginLogs.filter(l => l.success).length;
  const failedLogins = loginLogs.filter(l => !l.success).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - Fixed Top Left */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 gap-2 bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:bg-card"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Tillbaka till appen</span>
      </Button>

      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-br from-amber-500/10 via-background to-background border-b border-border">
        <div className="container py-16 pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500 shadow-lg mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Välkommen, Admin 👑
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Här kan du hantera användare och övervaka systemet.
            </p>
            <Badge variant="outline" className="gap-2 px-4 py-2 text-sm">
              <Shield className="w-4 h-4 text-amber-500" />
              Administratörspanel
            </Badge>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container py-4">
        <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "users" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            Användare
          </button>
          <button
            onClick={() => setActiveTab("moderation")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "moderation" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flag className="w-4 h-4" />
            Moderation
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "logs" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-4 h-4" />
            Loggar
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "settings" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            Inställningar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container pb-12">
        {activeTab === "settings" ? (
          <SettingsTab />
        ) : activeTab === "moderation" ? (
          <ModerationTab />
        ) : activeTab === "users" ? (
          /* Users Tab */
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                    <p className="text-xs text-muted-foreground">Registrerade användare</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{successfulLogins}</p>
                    <p className="text-xs text-muted-foreground">Lyckade inloggningar</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{failedLogins}</p>
                    <p className="text-xs text-muted-foreground">Misslyckade försök</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Alla användare
                </h2>
              </div>
              
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Inga användare registrerade</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {users.map((profile) => (
                    <div key={profile.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {profile.display_name?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {profile.display_name || "Okänd användare"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Registrerad: {formatDate(profile.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            Senast inloggad: {formatDate(profile.last_login)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Login Logs Tab */
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Senaste inloggningsförsök
              </h2>
            </div>
            
            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : loginLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Inga inloggningsloggar</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {loginLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.success ? "bg-green-500/10" : "bg-destructive/10"
                        }`}>
                          {log.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {log.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.ip_address || "Okänd IP"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={log.success ? "default" : "destructive"} className="text-xs">
                          {log.success ? "Lyckad" : "Misslyckad"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

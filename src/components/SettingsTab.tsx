import { useState, useEffect } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useLanguage, translations, Language } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Save,
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { sv, enUS, de, nb, fi, es } from "date-fns/locale";
import { toast } from "sonner";

interface ChatHistory {
  id: string;
  content: string;
  role: string;
  created_at: string;
  animal_id: string | null;
}

const dateLocales = {
  sv: sv,
  en: enUS,
  de: de,
  no: nb,
  fi: fi,
  es: es
} as const;

export function SettingsTab() {
  const { user } = useAuth();
  const { settings, isLoading: settingsLoading, saveSettings } = useUserSettings();
  const { language, setLanguage: setGlobalLanguage, t } = useLanguage();
  const [localLanguage, setLocalLanguage] = useState<Language>(language);
  const [theme, setTheme] = useState(settings.theme);
  const [isSaving, setIsSaving] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Update local state when settings load
  useEffect(() => {
    setLocalLanguage(settings.language as Language);
    setTheme(settings.theme);
  }, [settings]);

  // Apply theme immediately when changed
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Fetch user's chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) {
        setIsLoadingHistory(false);
        return;
      }

      const { data, error } = await supabase
        .from("ai_chat_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching chat history:", error);
      } else {
        setChatHistory(data || []);
      }
      setIsLoadingHistory(false);
    };

    fetchChatHistory();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Update global language immediately
    setGlobalLanguage(localLanguage);
    
    const success = await saveSettings({ language: localLanguage, theme });
    if (success) {
      toast.success(t("settings.saved"));
    } else {
      toast.error(t("settings.error"));
    }
    setIsSaving(false);
  };

  const formatDate = (date: string) => {
    const locale = dateLocales[localLanguage] || sv;
    return format(new Date(date), "d MMM yyyy HH:mm", { locale });
  };

  const languages = [
    { value: "sv", label: "🇸🇪 Svenska" },
    { value: "en", label: "🇬🇧 English" },
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "no", label: "🇳🇴 Norsk" },
    { value: "fi", label: "🇫🇮 Suomi" },
    { value: "es", label: "🇪🇸 Español" }
  ];

  const themes = [
    { value: "system", labelKey: "settings.themeSystem" as const, icon: Monitor },
    { value: "light", labelKey: "settings.themeLight" as const, icon: Sun },
    { value: "dark", labelKey: "settings.themeDark" as const, icon: Moon }
  ];

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Language Setting */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t("settings.language")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("settings.languageDesc")}
          </p>
        </div>
        <div className="p-4">
          <Select value={localLanguage} onValueChange={(val) => setLocalLanguage(val as Language)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("settings.language")} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Theme Setting */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Sun className="w-4 h-4" />
            {t("settings.theme")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("settings.themeDesc")}
          </p>
        </div>
        <div className="p-4">
          <div className="flex gap-2 flex-wrap">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    theme === themeOption.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(themeOption.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full"
        size="lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("settings.saving")}
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {t("settings.save")}
          </>
        )}
      </Button>

      {/* User's Chat History (only own data) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t("settings.chatHistory")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("settings.chatHistoryDesc")}
          </p>
        </div>
        
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{t("settings.noChatHistory")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {chatHistory.map((msg) => (
              <div key={msg.id} className="p-3">
                <p className="text-sm text-foreground line-clamp-2">
                  {msg.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(msg.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {t("settings.accountInfo")}
          </h2>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("settings.loggedInAs")}</span>
            <Badge variant="outline">{user?.email || t("settings.unknown")}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("settings.accountId")}</span>
            <Badge variant="outline" className="font-mono text-xs">
              {user?.id?.slice(0, 8)}...
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

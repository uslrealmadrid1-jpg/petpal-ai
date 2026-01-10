import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserSettings {
  language: string;
  theme: string;
}

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    language: "sv",
    theme: "system"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user settings:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setSettings({
          language: data.language,
          theme: data.theme
        });
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [user]);

  // Save settings
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return false;

    const updatedSettings = { ...settings, ...newSettings };
    
    // Check if settings exist
    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let error;
    if (existing) {
      // Update
      const result = await supabase
        .from("user_settings")
        .update({
          language: updatedSettings.language,
          theme: updatedSettings.theme,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
      error = result.error;
    } else {
      // Insert
      const result = await supabase
        .from("user_settings")
        .insert({
          user_id: user.id,
          language: updatedSettings.language,
          theme: updatedSettings.theme
        });
      error = result.error;
    }

    if (error) {
      console.error("Error saving settings:", error);
      return false;
    }

    setSettings(updatedSettings);
    return true;
  };

  return { settings, isLoading, saveSettings };
}

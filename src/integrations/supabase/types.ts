export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          animal_id: string | null
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          animal_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          animal_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_diseases: {
        Row: {
          animal_id: string
          åtgärd: string | null
          created_at: string | null
          id: string
          namn: string
          symptom: string[] | null
        }
        Insert: {
          animal_id: string
          åtgärd?: string | null
          created_at?: string | null
          id?: string
          namn: string
          symptom?: string[] | null
        }
        Update: {
          animal_id?: string
          åtgärd?: string | null
          created_at?: string | null
          id?: string
          namn?: string
          symptom?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_diseases_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_food: {
        Row: {
          animal_id: string
          created_at: string | null
          frekvens: string | null
          id: string
          mängd: string | null
          typ: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          frekvens?: string | null
          id?: string
          mängd?: string | null
          typ: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          frekvens?: string | null
          id?: string
          mängd?: string | null
          typ?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_food_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_requirements: {
        Row: {
          aktivitet_sover: string | null
          aktivitet_timmar: string | null
          aktivitet_vaknar: string | null
          animal_id: string
          belysning: string | null
          beteende_aktivitet: string | null
          beteende_lek: string | null
          beteende_social: string | null
          bostad: string | null
          created_at: string | null
          fuktighet: string | null
          id: string
          substrat: string | null
          temperatur: string | null
          vatten_behandling: string | null
          vatten_dryck: string | null
        }
        Insert: {
          aktivitet_sover?: string | null
          aktivitet_timmar?: string | null
          aktivitet_vaknar?: string | null
          animal_id: string
          belysning?: string | null
          beteende_aktivitet?: string | null
          beteende_lek?: string | null
          beteende_social?: string | null
          bostad?: string | null
          created_at?: string | null
          fuktighet?: string | null
          id?: string
          substrat?: string | null
          temperatur?: string | null
          vatten_behandling?: string | null
          vatten_dryck?: string | null
        }
        Update: {
          aktivitet_sover?: string | null
          aktivitet_timmar?: string | null
          aktivitet_vaknar?: string | null
          animal_id?: string
          belysning?: string | null
          beteende_aktivitet?: string | null
          beteende_lek?: string | null
          beteende_social?: string | null
          bostad?: string | null
          created_at?: string | null
          fuktighet?: string | null
          id?: string
          substrat?: string | null
          temperatur?: string | null
          vatten_behandling?: string | null
          vatten_dryck?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_requirements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_warnings: {
        Row: {
          animal_id: string
          created_at: string | null
          id: string
          varning: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          id?: string
          varning: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          id?: string
          varning?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_warnings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          aktivitet: Database["public"]["Enums"]["activity_type"] | null
          beskrivning: string | null
          created_at: string | null
          emoji: string | null
          id: string
          kategori: Database["public"]["Enums"]["animal_category"]
          livslängd_år: string | null
          namn: string
          svårighet: Database["public"]["Enums"]["difficulty_level"] | null
          theme: string | null
          updated_at: string | null
          vetenskapligt_namn: string | null
        }
        Insert: {
          aktivitet?: Database["public"]["Enums"]["activity_type"] | null
          beskrivning?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          kategori: Database["public"]["Enums"]["animal_category"]
          livslängd_år?: string | null
          namn: string
          svårighet?: Database["public"]["Enums"]["difficulty_level"] | null
          theme?: string | null
          updated_at?: string | null
          vetenskapligt_namn?: string | null
        }
        Update: {
          aktivitet?: Database["public"]["Enums"]["activity_type"] | null
          beskrivning?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          kategori?: Database["public"]["Enums"]["animal_category"]
          livslängd_år?: string | null
          namn?: string
          svårighet?: Database["public"]["Enums"]["difficulty_level"] | null
          theme?: string | null
          updated_at?: string | null
          vetenskapligt_namn?: string | null
        }
        Relationships: []
      }
      checklist_templates: {
        Row: {
          animal_id: string
          created_at: string | null
          id: string
          item: string
          sort_order: number | null
          typ: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          id?: string
          item: string
          sort_order?: number | null
          typ: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          id?: string
          item?: string
          sort_order?: number | null
          typ?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      login_logs: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          last_login: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          last_login?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_login?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_checklist_progress: {
        Row: {
          checked: boolean | null
          checked_at: string | null
          created_at: string | null
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          checked?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          checked?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checklist_progress_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          animal_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_type: "Dagaktiv" | "Nattaktiv" | "Skymningsaktiv"
      animal_category:
        | "Reptil"
        | "Däggdjur"
        | "Fågel"
        | "Groddjur"
        | "Kräftdjur"
        | "Fisk"
      app_role: "admin" | "moderator" | "user"
      difficulty_level: "Nybörjare" | "Medel" | "Avancerad"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: ["Dagaktiv", "Nattaktiv", "Skymningsaktiv"],
      animal_category: [
        "Reptil",
        "Däggdjur",
        "Fågel",
        "Groddjur",
        "Kräftdjur",
        "Fisk",
      ],
      app_role: ["admin", "moderator", "user"],
      difficulty_level: ["Nybörjare", "Medel", "Avancerad"],
    },
  },
} as const

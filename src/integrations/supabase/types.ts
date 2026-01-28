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
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      consultation_photos: {
        Row: {
          consultation_id: string
          created_at: string
          id: string
          photo_type: string
          storage_path: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          id?: string
          photo_type: string
          storage_path: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          id?: string
          photo_type?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_photos_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          additional_notes: string | null
          allergies_description: string | null
          biological_sex: string | null
          body_locations: string[] | null
          change_description: string | null
          concern_category: string | null
          consultation_price: number | null
          created_at: string
          date_of_birth: string | null
          doctor_id: string | null
          doctor_response: string | null
          has_allergies: boolean | null
          has_changed: boolean | null
          has_self_treated: boolean | null
          honorarnote_number: string | null
          honorarnote_storage_path: string | null
          icd10_code: string | null
          icd10_description: string | null
          id: string
          medications_description: string | null
          patient_id: string | null
          payment_status: string | null
          pricing_plan: string | null
          responded_at: string | null
          self_treatment_description: string | null
          status: Database["public"]["Enums"]["consultation_status"]
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          submitted_at: string | null
          symptom_onset: string | null
          symptom_severity: string | null
          symptoms: Json | null
          takes_medications: boolean | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          allergies_description?: string | null
          biological_sex?: string | null
          body_locations?: string[] | null
          change_description?: string | null
          concern_category?: string | null
          consultation_price?: number | null
          created_at?: string
          date_of_birth?: string | null
          doctor_id?: string | null
          doctor_response?: string | null
          has_allergies?: boolean | null
          has_changed?: boolean | null
          has_self_treated?: boolean | null
          honorarnote_number?: string | null
          honorarnote_storage_path?: string | null
          icd10_code?: string | null
          icd10_description?: string | null
          id?: string
          medications_description?: string | null
          patient_id?: string | null
          payment_status?: string | null
          pricing_plan?: string | null
          responded_at?: string | null
          self_treatment_description?: string | null
          status?: Database["public"]["Enums"]["consultation_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          submitted_at?: string | null
          symptom_onset?: string | null
          symptom_severity?: string | null
          symptoms?: Json | null
          takes_medications?: boolean | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          allergies_description?: string | null
          biological_sex?: string | null
          body_locations?: string[] | null
          change_description?: string | null
          concern_category?: string | null
          consultation_price?: number | null
          created_at?: string
          date_of_birth?: string | null
          doctor_id?: string | null
          doctor_response?: string | null
          has_allergies?: boolean | null
          has_changed?: boolean | null
          has_self_treated?: boolean | null
          honorarnote_number?: string | null
          honorarnote_storage_path?: string | null
          icd10_code?: string | null
          icd10_description?: string | null
          id?: string
          medications_description?: string | null
          patient_id?: string | null
          payment_status?: string | null
          pricing_plan?: string | null
          responded_at?: string | null
          self_treatment_description?: string | null
          status?: Database["public"]["Enums"]["consultation_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          submitted_at?: string | null
          symptom_onset?: string | null
          symptom_severity?: string | null
          symptoms?: Json | null
          takes_medications?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          doctor_id: string
          practice_name: string | null
          referral_code: string | null
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          doctor_id: string
          practice_name?: string | null
          referral_code?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          doctor_id?: string
          practice_name?: string | null
          referral_code?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      honorarnote_counter: {
        Row: {
          last_number: number | null
          year: number
        }
        Insert: {
          last_number?: number | null
          year: number
        }
        Update: {
          last_number?: number | null
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bic: string | null
          biological_sex: string | null
          created_at: string
          date_of_birth: string | null
          doctor_queue_type:
            | Database["public"]["Enums"]["doctor_queue_type"]
            | null
          full_name: string | null
          iban: string | null
          id: string
          insurance_provider: string | null
          is_active: boolean | null
          patient_address_city: string | null
          patient_address_street: string | null
          patient_address_zip: string | null
          phone: string | null
          practice_address_city: string | null
          practice_address_street: string | null
          practice_address_zip: string | null
          practice_name: string | null
          referral_code: string | null
          social_security_number: string | null
          standard_price: number | null
          uid_number: string | null
          updated_at: string
          urgent_price: number | null
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          bic?: string | null
          biological_sex?: string | null
          created_at?: string
          date_of_birth?: string | null
          doctor_queue_type?:
            | Database["public"]["Enums"]["doctor_queue_type"]
            | null
          full_name?: string | null
          iban?: string | null
          id: string
          insurance_provider?: string | null
          is_active?: boolean | null
          patient_address_city?: string | null
          patient_address_street?: string | null
          patient_address_zip?: string | null
          phone?: string | null
          practice_address_city?: string | null
          practice_address_street?: string | null
          practice_address_zip?: string | null
          practice_name?: string | null
          referral_code?: string | null
          social_security_number?: string | null
          standard_price?: number | null
          uid_number?: string | null
          updated_at?: string
          urgent_price?: number | null
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          bic?: string | null
          biological_sex?: string | null
          created_at?: string
          date_of_birth?: string | null
          doctor_queue_type?:
            | Database["public"]["Enums"]["doctor_queue_type"]
            | null
          full_name?: string | null
          iban?: string | null
          id?: string
          insurance_provider?: string | null
          is_active?: boolean | null
          patient_address_city?: string | null
          patient_address_street?: string | null
          patient_address_zip?: string | null
          phone?: string | null
          practice_address_city?: string | null
          practice_address_street?: string | null
          practice_address_zip?: string | null
          practice_name?: string | null
          referral_code?: string | null
          social_security_number?: string | null
          standard_price?: number | null
          uid_number?: string | null
          updated_at?: string
          urgent_price?: number | null
          welcome_message?: string | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      get_doctor_queue_type: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["doctor_queue_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
      consultation_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "completed"
        | "cancelled"
      doctor_queue_type: "group" | "individual" | "hybrid"
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
      app_role: ["patient", "doctor", "admin"],
      consultation_status: [
        "draft",
        "submitted",
        "in_review",
        "completed",
        "cancelled",
      ],
      doctor_queue_type: ["group", "individual", "hybrid"],
    },
  },
} as const

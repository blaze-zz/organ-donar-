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
      doctors: {
        Row: {
          created_at: string
          hospital_id: string | null
          id: string
          is_active: boolean | null
          license_number: string
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          license_number: string
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          city: string
          contact_phone: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          state: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          state: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      organ_donations: {
        Row: {
          assigned_doctor_id: string | null
          created_at: string
          donor_id: string
          hospital_id: string | null
          id: string
          notes: string | null
          organ_type: Database["public"]["Enums"]["organ_type"]
          otp_code: string | null
          otp_verified: boolean | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          assigned_doctor_id?: string | null
          created_at?: string
          donor_id: string
          hospital_id?: string | null
          id?: string
          notes?: string | null
          organ_type: Database["public"]["Enums"]["organ_type"]
          otp_code?: string | null
          otp_verified?: boolean | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          assigned_doctor_id?: string | null
          created_at?: string
          donor_id?: string
          hospital_id?: string | null
          id?: string
          notes?: string | null
          organ_type?: Database["public"]["Enums"]["organ_type"]
          otp_code?: string | null
          otp_verified?: boolean | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organ_donations_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organ_donations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      organ_inventory: {
        Row: {
          collected_at: string | null
          created_at: string
          donation_id: string | null
          expires_at: string | null
          hospital_id: string
          id: string
          is_available: boolean | null
          organ_type: Database["public"]["Enums"]["organ_type"]
        }
        Insert: {
          collected_at?: string | null
          created_at?: string
          donation_id?: string | null
          expires_at?: string | null
          hospital_id: string
          id?: string
          is_available?: boolean | null
          organ_type: Database["public"]["Enums"]["organ_type"]
        }
        Update: {
          collected_at?: string | null
          created_at?: string
          donation_id?: string | null
          expires_at?: string | null
          hospital_id?: string
          id?: string
          is_available?: boolean | null
          organ_type?: Database["public"]["Enums"]["organ_type"]
        }
        Relationships: [
          {
            foreignKeyName: "organ_inventory_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "organ_donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organ_inventory_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      organ_requests: {
        Row: {
          assigned_doctor_id: string | null
          created_at: string
          hospital_id: string | null
          id: string
          medical_condition: string | null
          notes: string | null
          organ_type: Database["public"]["Enums"]["organ_type"]
          requester_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency_level: number | null
        }
        Insert: {
          assigned_doctor_id?: string | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          medical_condition?: string | null
          notes?: string | null
          organ_type: Database["public"]["Enums"]["organ_type"]
          requester_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency_level?: number | null
        }
        Update: {
          assigned_doctor_id?: string | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          medical_condition?: string | null
          notes?: string | null
          organ_type?: Database["public"]["Enums"]["organ_type"]
          requester_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organ_requests_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organ_requests_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          blood_group: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      organ_type:
        | "heart"
        | "kidney"
        | "liver"
        | "lungs"
        | "pancreas"
        | "intestines"
        | "corneas"
        | "skin"
        | "bone_marrow"
      request_status:
        | "pending"
        | "approved"
        | "rejected"
        | "completed"
        | "cancelled"
      user_role: "admin" | "doctor" | "user"
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
      organ_type: [
        "heart",
        "kidney",
        "liver",
        "lungs",
        "pancreas",
        "intestines",
        "corneas",
        "skin",
        "bone_marrow",
      ],
      request_status: [
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      user_role: ["admin", "doctor", "user"],
    },
  },
} as const

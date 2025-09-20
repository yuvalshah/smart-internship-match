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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          permissions: Json | null
          phone_number: string | null
          role: Database["public"]["Enums"]["admin_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          permissions?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          permissions?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      allocations: {
        Row: {
          allocated_by: string | null
          allocation_reason: string | null
          completion_certificate_url: string | null
          created_at: string | null
          end_date: string | null
          id: string
          internship_id: string | null
          performance_rating: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["allocation_status"] | null
          stipend_amount: number | null
          student_id: string | null
          supervisor_email: string | null
          supervisor_name: string | null
          supervisor_phone: string | null
          updated_at: string | null
        }
        Insert: {
          allocated_by?: string | null
          allocation_reason?: string | null
          completion_certificate_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          internship_id?: string | null
          performance_rating?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["allocation_status"] | null
          stipend_amount?: number | null
          student_id?: string | null
          supervisor_email?: string | null
          supervisor_name?: string | null
          supervisor_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          allocated_by?: string | null
          allocation_reason?: string | null
          completion_certificate_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          internship_id?: string | null
          performance_rating?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["allocation_status"] | null
          stipend_amount?: number | null
          student_id?: string | null
          supervisor_email?: string | null
          supervisor_name?: string | null
          supervisor_phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allocations_allocated_by_fkey"
            columns: ["allocated_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_notes: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          internship_id: string | null
          interview_date: string | null
          interview_notes: string | null
          offer_letter_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          application_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          internship_id?: string | null
          interview_date?: string | null
          interview_notes?: string | null
          offer_letter_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          application_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          internship_id?: string | null
          interview_date?: string | null
          interview_notes?: string | null
          offer_letter_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          created_at: string | null
          id: string
          is_bot_message: boolean | null
          message: string
          message_type: Database["public"]["Enums"]["message_type"] | null
          session_id: string
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_bot_message?: boolean | null
          message: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          session_id: string
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_bot_message?: boolean | null
          message?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          session_id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_size: string | null
          contact_person_name: string | null
          contact_person_position: string | null
          created_at: string | null
          description: string | null
          email: string
          headquarters_location: string | null
          id: string
          industry: string | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          phone_number: string | null
          social_media_links: Json | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          company_size?: string | null
          contact_person_name?: string | null
          contact_person_position?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          phone_number?: string | null
          social_media_links?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          company_size?: string | null
          contact_person_name?: string | null
          contact_person_position?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          phone_number?: string | null
          social_media_links?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["email_category"] | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_name: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body: string
          category?: Database["public"]["Enums"]["email_category"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          subject: string
          template_name: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["email_category"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string
          template_name?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          challenges_faced: string | null
          comments: string | null
          created_at: string | null
          id: string
          internship_id: string | null
          is_anonymous: boolean | null
          is_approved: boolean | null
          learning_experience_rating: number | null
          mentorship_rating: number | null
          overall_experience: string | null
          rating: number | null
          student_id: string | null
          suggestions: string | null
          updated_at: string | null
          work_environment_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          challenges_faced?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          internship_id?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          learning_experience_rating?: number | null
          mentorship_rating?: number | null
          overall_experience?: string | null
          rating?: number | null
          student_id?: string | null
          suggestions?: string | null
          updated_at?: string | null
          work_environment_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          challenges_faced?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          internship_id?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          learning_experience_rating?: number | null
          mentorship_rating?: number | null
          overall_experience?: string | null
          rating?: number | null
          student_id?: string | null
          suggestions?: string | null
          updated_at?: string | null
          work_environment_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          application_deadline: string | null
          application_process: string | null
          approved_by: string | null
          available_positions: number | null
          benefits: string[] | null
          cgpa_requirement: number | null
          company_id: string | null
          created_at: string | null
          description: string | null
          duration_weeks: number | null
          end_date: string | null
          filled_positions: number | null
          id: string
          internship_type: Database["public"]["Enums"]["internship_type"] | null
          is_active: boolean | null
          is_approved: boolean | null
          location: string | null
          skills_required: string[] | null
          start_date: string | null
          stipend_amount: number | null
          stipend_currency: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          application_deadline?: string | null
          application_process?: string | null
          approved_by?: string | null
          available_positions?: number | null
          benefits?: string[] | null
          cgpa_requirement?: number | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          filled_positions?: number | null
          id?: string
          internship_type?:
            | Database["public"]["Enums"]["internship_type"]
            | null
          is_active?: boolean | null
          is_approved?: boolean | null
          location?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          stipend_amount?: number | null
          stipend_currency?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          application_deadline?: string | null
          application_process?: string | null
          approved_by?: string | null
          available_positions?: number | null
          benefits?: string[] | null
          cgpa_requirement?: number | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          filled_positions?: number | null
          id?: string
          internship_type?:
            | Database["public"]["Enums"]["internship_type"]
            | null
          is_active?: boolean | null
          is_approved?: boolean | null
          location?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          stipend_amount?: number | null
          stipend_currency?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          updated_at: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string | null
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string | null
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      skills_catalog: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          popularity_count: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          popularity_count?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          popularity_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_year: number | null
          address: string | null
          cgpa: number | null
          created_at: string | null
          date_of_birth: string | null
          department: string | null
          email: string
          enrollment_number: string | null
          github_url: string | null
          id: string
          is_verified: boolean | null
          last_login: string | null
          linkedin_url: string | null
          name: string
          phone_number: string | null
          preferences: Json | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          verification_token: string | null
        }
        Insert: {
          academic_year?: number | null
          address?: string | null
          cgpa?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email: string
          enrollment_number?: string | null
          github_url?: string | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          linkedin_url?: string | null
          name: string
          phone_number?: string | null
          preferences?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          verification_token?: string | null
        }
        Update: {
          academic_year?: number | null
          address?: string | null
          cgpa?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email?: string
          enrollment_number?: string | null
          github_url?: string | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          linkedin_url?: string | null
          name?: string
          phone_number?: string | null
          preferences?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          verification_token?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          data_type: Database["public"]["Enums"]["data_type"] | null
          description: string | null
          id: string
          is_editable: boolean | null
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_type?: Database["public"]["Enums"]["data_type"] | null
          description?: string | null
          id?: string
          is_editable?: boolean | null
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: Database["public"]["Enums"]["data_type"] | null
          description?: string | null
          id?: string
          is_editable?: boolean | null
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      admin_role: "superadmin" | "placement_officer" | "reviewer"
      allocation_status: "pending" | "approved" | "rejected"
      application_status: "pending" | "accepted" | "rejected"
      data_type: "string" | "number" | "boolean" | "json"
      email_category: "application" | "allocation" | "notification" | "reminder"
      internship_type: "onsite" | "remote" | "hybrid"
      message_type: "text" | "quick_reply" | "suggestion"
      notification_type:
        | "application"
        | "allocation"
        | "deadline"
        | "system"
        | "alert"
      user_type: "student" | "admin" | "company"
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
      admin_role: ["superadmin", "placement_officer", "reviewer"],
      allocation_status: ["pending", "approved", "rejected"],
      application_status: ["pending", "accepted", "rejected"],
      data_type: ["string", "number", "boolean", "json"],
      email_category: ["application", "allocation", "notification", "reminder"],
      internship_type: ["onsite", "remote", "hybrid"],
      message_type: ["text", "quick_reply", "suggestion"],
      notification_type: [
        "application",
        "allocation",
        "deadline",
        "system",
        "alert",
      ],
      user_type: ["student", "admin", "company"],
    },
  },
} as const

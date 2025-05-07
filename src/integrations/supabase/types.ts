export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
          type: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
          type: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
          type?: string
          xp?: number
        }
        Relationships: []
      }
      content_items: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string | null
          featured: boolean | null
          id: string
          image: string | null
          slug: string
          status: string
          tags: Json | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          slug: string
          status?: string
          tags?: Json | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          slug?: string
          status?: string
          tags?: Json | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          applicable_exams: Json | null
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          max_discount_amount: number | null
          min_purchase_amount: number | null
          updated_at: string | null
          usage_count: number
          usage_limit: number
          valid_from: string
          valid_until: string
        }
        Insert: {
          active?: boolean | null
          applicable_exams?: Json | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          usage_count?: number
          usage_limit?: number
          valid_from?: string
          valid_until: string
        }
        Update: {
          active?: boolean | null
          applicable_exams?: Json | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          usage_count?: number
          usage_limit?: number
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      exam_attempts: {
        Row: {
          correct_answers: number
          created_at: string | null
          end_time: string | null
          exam_id: string
          id: string
          score: number | null
          start_time: string
          status: string
          total_questions: number
          user_id: string
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          end_time?: string | null
          exam_id: string
          id?: string
          score?: number | null
          start_time?: string
          status?: string
          total_questions: number
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          end_time?: string | null
          exam_id?: string
          id?: string
          score?: number | null
          start_time?: string
          status?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          difficulty: string
          discount_expires_at: string | null
          discount_percentage: number | null
          discount_price: number | null
          duration: number
          id: string
          passing_score: number
          price: number
          purchases: number
          questions_count: number
          rating: number
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          discount_expires_at?: string | null
          discount_percentage?: number | null
          discount_price?: number | null
          duration: number
          id?: string
          passing_score?: number
          price?: number
          purchases?: number
          questions_count?: number
          rating?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          difficulty?: string
          discount_expires_at?: string | null
          discount_percentage?: number | null
          discount_price?: number | null
          duration?: number
          id?: string
          passing_score?: number
          price?: number
          purchases?: number
          questions_count?: number
          rating?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      options: {
        Row: {
          id: string
          is_correct: boolean
          question_id: string
          text: string
        }
        Insert: {
          id?: string
          is_correct?: boolean
          question_id: string
          text: string
        }
        Update: {
          id?: string
          is_correct?: boolean
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          method: string
          order_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          method: string
          order_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          method?: string
          order_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          attempts_left: number
          created_at: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          plan_type: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts_left?: number
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          plan_type?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts_left?: number
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          plan_type?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          exam_id: string
          explanation: string | null
          id: string
          text: string
        }
        Insert: {
          created_at?: string | null
          exam_id: string
          explanation?: string | null
          id?: string
          text: string
        }
        Update: {
          created_at?: string | null
          exam_id?: string
          explanation?: string | null
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          attempt_id: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string
          selected_option_id: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id: string
          selected_option_id?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

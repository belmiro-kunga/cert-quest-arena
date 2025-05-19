export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
          avatar_url: string | null
          preferences: Json | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          preferences?: Json | null
        }
      }
      simulados: {
        Row: {
          id: string
          title: string
          description: string
          duration: number
          total_questions: number
          passing_score: number
          is_active: boolean
          created_at: string
          updated_at: string
          price: number
          category: string
          tags: string[]
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          duration: number
          total_questions: number
          passing_score: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          price: number
          category: string
          tags?: string[]
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          duration?: number
          total_questions?: number
          passing_score?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          price?: number
          category?: string
          tags?: string[]
          image_url?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          simulado_id: string
          question_text: string
          correct_answer: string
          options: string[]
          explanation: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          simulado_id: string
          question_text: string
          correct_answer: string
          options: string[]
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          simulado_id?: string
          question_text?: string
          correct_answer?: string
          options?: string[]
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          simulado_id: string
          score: number
          completed_at: string
          answers: Json
          time_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          simulado_id: string
          score: number
          completed_at: string
          answers: Json
          time_spent: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          simulado_id?: string
          score?: number
          completed_at?: string
          answers?: Json
          time_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          points: number
          category: string
          requirements: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          points: number
          category: string
          requirements: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          points?: number
          category?: string
          requirements?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string
          payment_date: string
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string
          payment_date: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string
          payment_date?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
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
  }
} 
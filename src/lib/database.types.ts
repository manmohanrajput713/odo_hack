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
      profiles: {
        Row: {
          id: string
          name: string
          location: string | null
          skills_offered: string[]
          skills_wanted: string[]
          availability: string[]
          is_public: boolean
          rating: number
          total_ratings: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          location?: string | null
          skills_offered?: string[]
          skills_wanted?: string[]
          availability?: string[]
          is_public?: boolean
          rating?: number
          total_ratings?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          skills_offered?: string[]
          skills_wanted?: string[]
          availability?: string[]
          is_public?: boolean
          rating?: number
          total_ratings?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          skill_offered: string
          skill_wanted: string
          message: string
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          skill_offered: string
          skill_wanted: string
          message: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          skill_offered?: string
          skill_wanted?: string
          message?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string
          completed_at?: string | null
        }
      }
      ratings: {
        Row: {
          id: string
          swap_request_id: string
          from_user_id: string
          to_user_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          swap_request_id: string
          from_user_id: string
          to_user_id: string
          rating: number
          comment?: string
          created_at?: string
        }
        Update: {
          id?: string
          swap_request_id?: string
          from_user_id?: string
          to_user_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
    }
  }
}
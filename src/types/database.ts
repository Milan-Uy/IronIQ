export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          fitness_goal: string | null;
          experience_level: string | null;
          preferred_split: string | null;
          workouts_per_week: number | null;
          body_specialization: string[] | null;
          weight_unit: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          fitness_goal?: string | null;
          experience_level?: string | null;
          preferred_split?: string | null;
          workouts_per_week?: number | null;
          body_specialization?: string[] | null;
          weight_unit?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          fitness_goal?: string | null;
          experience_level?: string | null;
          preferred_split?: string | null;
          workouts_per_week?: number | null;
          body_specialization?: string[] | null;
          weight_unit?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_programs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          split_type: string;
          days_per_week: number;
          is_template: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          split_type: string;
          days_per_week: number;
          is_template?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          split_type?: string;
          days_per_week?: number;
          is_template?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_programs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_days: {
        Row: {
          id: string;
          program_id: string;
          name: string;
          day_order: number;
          target_muscles: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          name: string;
          day_order: number;
          target_muscles?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          name?: string;
          day_order?: number;
          target_muscles?: string[];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_days_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "workout_programs";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_exercises: {
        Row: {
          id: string;
          day_id: string;
          exercise_name: string;
          target_sets: number;
          target_reps: string;
          rest_seconds: number | null;
          exercise_order: number;
          notes: string | null;
          alternatives: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_id: string;
          exercise_name: string;
          target_sets: number;
          target_reps: string;
          rest_seconds?: number | null;
          exercise_order: number;
          notes?: string | null;
          alternatives?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_id?: string;
          exercise_name?: string;
          target_sets?: number;
          target_reps?: string;
          rest_seconds?: number | null;
          exercise_order?: number;
          notes?: string | null;
          alternatives?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_exercises_day_id_fkey";
            columns: ["day_id"];
            isOneToOne: false;
            referencedRelation: "workout_days";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          day_id: string;
          started_at: string;
          completed_at: string | null;
          notes: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_id: string;
          started_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          day_id?: string;
          started_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_sessions_day_id_fkey";
            columns: ["day_id"];
            isOneToOne: false;
            referencedRelation: "workout_days";
            referencedColumns: ["id"];
          },
        ];
      };
      session_sets: {
        Row: {
          id: string;
          session_id: string;
          exercise_name: string;
          set_number: number;
          reps: number;
          weight: number;
          rpe: number | null;
          is_warmup: boolean;
          was_substituted: boolean;
          original_exercise: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_name: string;
          set_number: number;
          reps: number;
          weight: number;
          rpe?: number | null;
          is_warmup?: boolean;
          was_substituted?: boolean;
          original_exercise?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          exercise_name?: string;
          set_number?: number;
          reps?: number;
          weight?: number;
          rpe?: number | null;
          is_warmup?: boolean;
          was_substituted?: boolean;
          original_exercise?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_sets_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "workout_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          structured_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          structured_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          content?: string;
          structured_data?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

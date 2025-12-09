import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com validação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente apenas se as credenciais forem válidas
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Status de configuração para UI
export const getSupabaseStatus = () => {
  if (isSupabaseConfigured()) {
    return {
      configured: true,
      message: '✅ Sincronização em nuvem ativa',
      mode: 'cloud'
    };
  }
  return {
    configured: false,
    message: '📱 Modo offline - dados salvos localmente',
    mode: 'local',
    instruction: 'Para ativar sincronização em nuvem, vá em Configurações → Integrações → Supabase'
  };
};

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          is_anonymous: boolean;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          is_anonymous?: boolean;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          is_anonymous?: boolean;
          name?: string | null;
          updated_at?: string;
        };
      };
      onboarding: {
        Row: {
          id: string;
          user_id: string;
          substance_type: 'alcohol' | 'cigarette' | 'both';
          frequency: number;
          duration: string;
          triggers: string[];
          goal: 'reduce' | 'quit';
          motivation: string;
          current_mood: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          substance_type: 'alcohol' | 'cigarette' | 'both';
          frequency: number;
          duration: string;
          triggers: string[];
          goal: 'reduce' | 'quit';
          motivation: string;
          current_mood: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          substance_type?: 'alcohol' | 'cigarette' | 'both';
          frequency?: number;
          duration?: string;
          triggers?: string[];
          goal?: 'reduce' | 'quit';
          motivation?: string;
          current_mood?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          days_clean: number;
          last_relapse_date: string | null;
          total_points: number;
          completed_tasks: number;
          current_streak: number;
          stress_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          days_clean?: number;
          last_relapse_date?: string | null;
          total_points?: number;
          completed_tasks?: number;
          current_streak?: number;
          stress_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          days_clean?: number;
          last_relapse_date?: string | null;
          total_points?: number;
          completed_tasks?: number;
          current_streak?: number;
          stress_level?: number;
          updated_at?: string;
        };
      };
      mood_history: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          mood?: string;
          notes?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          emoji: string;
          duration: number;
          points: number;
          completed: boolean;
          category: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          emoji: string;
          duration: number;
          points: number;
          completed?: boolean;
          category: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          emoji?: string;
          duration?: number;
          points?: number;
          completed?: boolean;
          category?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          emoji: string | null;
          analysis: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          emoji?: string | null;
          analysis?: any | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          emoji?: string | null;
          analysis?: any | null;
        };
      };
    };
  };
}

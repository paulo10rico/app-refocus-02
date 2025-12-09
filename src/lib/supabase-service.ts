import { supabase, isSupabaseConfigured } from './supabase';
import type { Database } from './supabase';

// Tipos
type User = Database['public']['Tables']['users']['Row'];
type OnboardingData = Database['public']['Tables']['onboarding']['Insert'];
type ProgressData = Database['public']['Tables']['progress']['Row'];
type TaskData = Database['public']['Tables']['tasks']['Row'];
type MoodData = Database['public']['Tables']['mood_history']['Insert'];
type ChatMessage = Database['public']['Tables']['chat_history']['Insert'];

// ==================== USUÁRIOS ====================

export async function createAnonymousUser(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('users')
      .insert({ is_anonymous: true })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// ==================== ONBOARDING ====================

export async function saveOnboarding(userId: string, onboardingData: Omit<OnboardingData, 'user_id'>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!
      .from('onboarding')
      .insert({ ...onboardingData, user_id: userId });

    if (error) throw error;

    // Criar registro de progresso inicial
    await supabase!
      .from('progress')
      .insert({
        user_id: userId,
        days_clean: 0,
        total_points: 0,
        completed_tasks: 0,
        current_streak: 0,
        stress_level: 5
      });

    return true;
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
    return false;
  }
}

export async function getOnboarding(userId: string) {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('onboarding')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar onboarding:', error);
    return null;
  }
}

// ==================== PROGRESSO ====================

export async function getProgress(userId: string): Promise<ProgressData | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return null;
  }
}

export async function updateProgress(userId: string, updates: Partial<ProgressData>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!
      .from('progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return false;
  }
}

export async function incrementPoints(userId: string, points: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const progress = await getProgress(userId);
    if (!progress) return false;

    return await updateProgress(userId, {
      total_points: progress.total_points + points,
      completed_tasks: progress.completed_tasks + 1
    });
  } catch (error) {
    console.error('Erro ao incrementar pontos:', error);
    return false;
  }
}

// ==================== TAREFAS ====================

export async function getTasks(userId: string): Promise<TaskData[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase!
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
}

export async function createTask(userId: string, task: Omit<TaskData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<TaskData | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase!
      .from('tasks')
      .insert({ ...task, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return null;
  }
}

export async function completeTask(taskId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // Buscar tarefa
    const { data: task, error: taskError } = await supabase!
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError) throw taskError;

    // Marcar como completa
    const { error: updateError } = await supabase!
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (updateError) throw updateError;

    // Incrementar pontos
    await incrementPoints(userId, task.points);

    return true;
  } catch (error) {
    console.error('Erro ao completar tarefa:', error);
    return false;
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return false;
  }
}

// ==================== HUMOR ====================

export async function saveMood(userId: string, mood: string, notes?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!
      .from('mood_history')
      .insert({
        user_id: userId,
        mood,
        notes: notes || null
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar humor:', error);
    return false;
  }
}

export async function getMoodHistory(userId: string, limit: number = 30) {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase!
      .from('mood_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de humor:', error);
    return [];
  }
}

// ==================== CHAT ====================

export async function saveChatMessage(userId: string, message: Omit<ChatMessage, 'user_id'>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!
      .from('chat_history')
      .insert({ ...message, user_id: userId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return false;
  }
}

export async function getChatHistory(userId: string, limit: number = 50) {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase!
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de chat:', error);
    return [];
  }
}

// ==================== SINCRONIZAÇÃO ====================

export async function syncLocalDataToSupabase(userId: string, localData: any): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // Sincronizar progresso
    if (localData.progress) {
      await updateProgress(userId, localData.progress);
    }

    // Sincronizar tarefas
    if (localData.tasks && Array.isArray(localData.tasks)) {
      for (const task of localData.tasks) {
        await createTask(userId, task);
      }
    }

    // Sincronizar humor
    if (localData.moodHistory && Array.isArray(localData.moodHistory)) {
      for (const mood of localData.moodHistory) {
        await saveMood(userId, mood.mood, mood.notes);
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
    return false;
  }
}

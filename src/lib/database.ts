import { supabase, isSupabaseConfigured } from './supabase';
import type { OnboardingData, UserProgress, DailyTask, MoodType } from './types';

// ============= USUÁRIOS =============

export async function createAnonymousUser(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return null;
  }
  
  try {
    const { data, error } = await supabase!
      .from('users')
      .insert({ is_anonymous: true })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Erro ao criar usuário anônimo:', error);
    return null;
  }
}

export async function getUserById(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return null;
  }
  
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

// ============= ONBOARDING =============

export async function saveOnboardingData(userId: string, data: OnboardingData) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    const { error } = await supabase!.from('onboarding').insert({
      user_id: userId,
      substance_type: data.substanceType,
      frequency: data.frequency,
      duration: data.duration,
      triggers: data.triggers,
      goal: data.goal,
      motivation: data.motivation,
      current_mood: data.currentMood,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
    return false;
  }
}

export async function getOnboardingData(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return null;
  }
  
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

// ============= PROGRESSO =============

export async function initializeUserProgress(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    const { error } = await supabase!.from('progress').insert({
      user_id: userId,
      days_clean: 0,
      total_points: 0,
      completed_tasks: 0,
      current_streak: 0,
      stress_level: 5,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao inicializar progresso:', error);
    return false;
  }
}

export async function getUserProgress(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return null;
  }
  
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

export async function updateUserProgress(userId: string, updates: Partial<UserProgress>) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    const { error } = await supabase!
      .from('progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return false;
  }
}

// ============= HUMOR =============

export async function addMoodEntry(userId: string, mood: MoodType, notes?: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    const { error } = await supabase!.from('mood_history').insert({
      user_id: userId,
      mood,
      notes,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao adicionar humor:', error);
    return false;
  }
}

export async function getMoodHistory(userId: string, limit = 30) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return [];
  }
  
  try {
    const { data, error } = await supabase!
      .from('mood_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico de humor:', error);
    return [];
  }
}

// ============= TAREFAS =============

export async function createDailyTasks(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  const tasks = [
    {
      user_id: userId,
      title: 'Exercício de Respiração',
      description: 'Complete 60 segundos de respiração guiada',
      emoji: '🌬️',
      duration: 1,
      points: 50,
      category: 'breathing',
    },
    {
      user_id: userId,
      title: 'Meditação Matinal',
      description: 'Pratique 5 minutos de meditação mindfulness',
      emoji: '🧘',
      duration: 5,
      points: 100,
      category: 'meditation',
    },
    {
      user_id: userId,
      title: 'Diário de Gratidão',
      description: 'Escreva 3 coisas pelas quais você é grato hoje',
      emoji: '📝',
      duration: 3,
      points: 75,
      category: 'journal',
    },
    {
      user_id: userId,
      title: 'Caminhada de 10 minutos',
      description: 'Faça uma caminhada leve ao ar livre',
      emoji: '🚶',
      duration: 10,
      points: 80,
      category: 'exercise',
    },
    {
      user_id: userId,
      title: 'Desafio: Evite Gatilhos',
      description: 'Identifique e evite um gatilho hoje',
      emoji: '🎯',
      duration: 0,
      points: 150,
      category: 'challenge',
    },
    {
      user_id: userId,
      title: 'Conversar com IA',
      description: 'Compartilhe como está se sentindo com a psicóloga IA',
      emoji: '💬',
      duration: 5,
      points: 60,
      category: 'journal',
    },
  ];

  try {
    const { error } = await supabase!.from('tasks').insert(tasks);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao criar tarefas:', error);
    return false;
  }
}

export async function getUserTasks(userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return [];
  }
  
  try {
    const { data, error } = await supabase!
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
}

export async function toggleTaskCompletion(taskId: string, userId: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    // Buscar tarefa atual
    const { data: task, error: fetchError } = await supabase!
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;

    const newCompleted = !task.completed;

    // Atualizar tarefa
    const { error: updateError } = await supabase!
      .from('tasks')
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    if (updateError) throw updateError;

    // Atualizar progresso do usuário
    const progress = await getUserProgress(userId);
    if (progress) {
      await updateUserProgress(userId, {
        total_points: newCompleted
          ? progress.total_points + task.points
          : progress.total_points - task.points,
        completed_tasks: newCompleted
          ? progress.completed_tasks + 1
          : progress.completed_tasks - 1,
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao alternar tarefa:', error);
    return false;
  }
}

// ============= CHAT =============

export async function saveChatMessage(
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  emoji?: string,
  analysis?: any
) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return false;
  }
  
  try {
    const { error } = await supabase!.from('chat_history').insert({
      user_id: userId,
      role,
      content,
      emoji,
      analysis,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return false;
  }
}

export async function getChatHistory(userId: string, limit = 50) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return [];
  }
  
  try {
    const { data, error } = await supabase!
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico de chat:', error);
    return [];
  }
}

// ============= ADMIN =============

export async function getAllUsers() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return [];
  }
  
  try {
    const { data, error } = await supabase!
      .from('users')
      .select('*, progress(*), onboarding(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

export async function getSystemMetrics() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não configurado');
    return {
      totalUsers: 0,
      totalTasks: 0,
      completedTasks: 0,
      totalPoints: 0,
      avgDaysClean: 0,
    };
  }
  
  try {
    const { count: totalUsers } = await supabase!
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: totalTasks } = await supabase!
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    const { count: completedTasks } = await supabase!
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true);

    const { data: progressData } = await supabase!
      .from('progress')
      .select('total_points, days_clean');

    const totalPoints = progressData?.reduce((sum, p) => sum + p.total_points, 0) || 0;
    const avgDaysClean = progressData?.length
      ? progressData.reduce((sum, p) => sum + p.days_clean, 0) / progressData.length
      : 0;

    return {
      totalUsers: totalUsers || 0,
      totalTasks: totalTasks || 0,
      completedTasks: completedTasks || 0,
      totalPoints,
      avgDaysClean: Math.round(avgDaysClean),
    };
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return {
      totalUsers: 0,
      totalTasks: 0,
      completedTasks: 0,
      totalPoints: 0,
      avgDaysClean: 0,
    };
  }
}

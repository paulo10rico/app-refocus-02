// Sistema de armazenamento híbrido do Refocus (localStorage + Supabase)
import type { OnboardingData, UserProgress, DailyTask, MoodType } from './types';
import { isSupabaseConfigured } from './supabase';
import {
  createAnonymousUser,
  saveOnboarding as saveOnboardingDB,
  getProgress as getProgressDB,
  updateProgress as updateProgressDB,
  saveMood,
  getTasks as getTasksDB,
  createTask,
  completeTask,
  incrementPoints,
} from './supabase-service';

const STORAGE_KEYS = {
  ONBOARDING: 'refocus_onboarding',
  PROGRESS: 'refocus_progress',
  TASKS: 'refocus_tasks',
  USER_ID: 'refocus_user_id',
};

// ============= USUÁRIO =============

export const initializeUser = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  if (!userId && isSupabaseConfigured()) {
    // Criar usuário anônimo no Supabase
    userId = await createAnonymousUser();
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
  } else if (!userId) {
    // Criar ID local se Supabase não configurado
    userId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  return userId;
};

export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

// ============= ONBOARDING =============

export const saveOnboarding = async (data: OnboardingData): Promise<void> => {
  if (typeof window === 'undefined') return;

  // Salvar localmente
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(data));

  // Salvar no Supabase se configurado
  if (isSupabaseConfigured()) {
    const userId = await initializeUser();
    if (userId) {
      const onboardingData = {
        substance_type: data.substanceType,
        frequency: data.frequency,
        duration: data.duration,
        triggers: data.triggers,
        goal: data.goal,
        motivation: data.motivation,
        current_mood: data.currentMood,
      };
      await saveOnboardingDB(userId, onboardingData);
    }
  }

  // Inicializar progresso e tarefas
  await initializeProgress();
};

export const getOnboarding = (): OnboardingData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
  return data ? JSON.parse(data) : null;
};

export const hasCompletedOnboarding = (): boolean => {
  return getOnboarding() !== null;
};

// ============= PROGRESSO =============

export const initializeProgress = async (): Promise<void> => {
  const initialProgress: UserProgress = {
    daysClean: 0,
    totalPoints: 0,
    completedTasks: 0,
    currentStreak: 0,
    stressLevel: 5,
    moodHistory: [
      {
        date: new Date(),
        mood: 'neutral' as MoodType,
      },
    ],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(initialProgress));
    await initializeDailyTasks();
  }
};

export const getUserProgress = async (): Promise<UserProgress | null> => {
  if (typeof window === 'undefined') return null;

  // Tentar buscar do Supabase primeiro
  if (isSupabaseConfigured()) {
    const userId = getUserId();
    if (userId) {
      const dbProgress = await getProgressDB(userId);
      if (dbProgress) {
        const progress: UserProgress = {
          daysClean: dbProgress.days_clean,
          totalPoints: dbProgress.total_points,
          completedTasks: dbProgress.completed_tasks,
          currentStreak: dbProgress.current_streak,
          stressLevel: dbProgress.stress_level,
          moodHistory: [],
          lastRelapseDate: dbProgress.last_relapse_date ? new Date(dbProgress.last_relapse_date) : undefined,
        };
        // Atualizar localStorage
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
        return progress;
      }
    }
  }

  // Fallback para localStorage
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
};

export const updateProgress = async (updates: Partial<UserProgress>): Promise<void> => {
  if (typeof window === 'undefined') return;

  const current = await getUserProgress();
  if (current) {
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));

    // Atualizar no Supabase se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        const dbUpdates: any = {};
        if (updates.daysClean !== undefined) dbUpdates.days_clean = updates.daysClean;
        if (updates.totalPoints !== undefined) dbUpdates.total_points = updates.totalPoints;
        if (updates.completedTasks !== undefined) dbUpdates.completed_tasks = updates.completedTasks;
        if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
        if (updates.stressLevel !== undefined) dbUpdates.stress_level = updates.stressLevel;
        if (updates.lastRelapseDate !== undefined) dbUpdates.last_relapse_date = updates.lastRelapseDate?.toISOString();

        await updateProgressDB(userId, dbUpdates);
      }
    }
  }
};

// ============= TAREFAS =============

export const initializeDailyTasks = async (): Promise<void> => {
  const tasks: DailyTask[] = [
    {
      id: '1',
      title: 'Exercício de Respiração',
      description: 'Complete 60 segundos de respiração guiada',
      emoji: '🌬️',
      duration: 1,
      points: 50,
      completed: false,
      category: 'breathing',
    },
    {
      id: '2',
      title: 'Meditação Matinal',
      description: 'Pratique 5 minutos de meditação mindfulness',
      emoji: '🧘',
      duration: 5,
      points: 100,
      completed: false,
      category: 'meditation',
    },
    {
      id: '3',
      title: 'Diário de Gratidão',
      description: 'Escreva 3 coisas pelas quais você é grato hoje',
      emoji: '📝',
      duration: 3,
      points: 75,
      completed: false,
      category: 'journal',
    },
    {
      id: '4',
      title: 'Caminhada de 10 minutos',
      description: 'Faça uma caminhada leve ao ar livre',
      emoji: '🚶',
      duration: 10,
      points: 80,
      completed: false,
      category: 'exercise',
    },
    {
      id: '5',
      title: 'Desafio: Evite Gatilhos',
      description: 'Identifique e evite um gatilho hoje',
      emoji: '🎯',
      duration: 0,
      points: 150,
      completed: false,
      category: 'challenge',
    },
    {
      id: '6',
      title: 'Conversar com IA',
      description: 'Compartilhe como está se sentindo com a psicóloga IA',
      emoji: '💬',
      duration: 5,
      points: 60,
      completed: false,
      category: 'journal',
    },
  ];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // Criar tarefas no Supabase se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        for (const task of tasks) {
          await createTask(userId, {
            title: task.title,
            description: task.description,
            emoji: task.emoji,
            duration: task.duration,
            points: task.points,
            completed: false,
            category: task.category,
            completed_at: null,
          });
        }
      }
    }
  }
};

export const getDailyTasks = async (): Promise<DailyTask[]> => {
  if (typeof window === 'undefined') return [];

  // Tentar buscar do Supabase primeiro
  if (isSupabaseConfigured()) {
    const userId = getUserId();
    if (userId) {
      const dbTasks = await getTasksDB(userId);
      if (dbTasks.length > 0) {
        const tasks: DailyTask[] = dbTasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          emoji: t.emoji,
          duration: t.duration,
          points: t.points,
          completed: t.completed,
          category: t.category,
        }));
        // Atualizar localStorage
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        return tasks;
      }
    }
  }

  // Fallback para localStorage
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const toggleTaskCompletion = async (taskId: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  const tasks = await getDailyTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    task.completed = !task.completed;

    // Atualiza pontos e tarefas completadas
    const progress = await getUserProgress();
    if (progress) {
      if (task.completed) {
        progress.totalPoints += task.points;
        progress.completedTasks += 1;
      } else {
        progress.totalPoints -= task.points;
        progress.completedTasks -= 1;
      }
      await updateProgress(progress);
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // Atualizar no Supabase se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId && task.completed) {
        await completeTask(taskId, userId);
      }
    }
  }
};

export const updateStressLevel = async (level: number): Promise<void> => {
  await updateProgress({ stressLevel: level });
};

export const addMoodEntry = async (mood: MoodType): Promise<void> => {
  const progress = await getUserProgress();
  if (progress) {
    progress.moodHistory.push({
      date: new Date(),
      mood,
    });
    await updateProgress(progress);

    // Salvar no Supabase se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        await saveMood(userId, mood);
      }
    }
  }
};

export const incrementDaysClean = async (): Promise<void> => {
  const progress = await getUserProgress();
  if (progress) {
    progress.daysClean += 1;
    progress.currentStreak += 1;
    await updateProgress(progress);
  }
};

export const resetStreak = async (): Promise<void> => {
  const progress = await getUserProgress();
  if (progress) {
    progress.lastRelapseDate = new Date();
    progress.currentStreak = 0;
    await updateProgress(progress);
  }
};

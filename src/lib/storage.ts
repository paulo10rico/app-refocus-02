// Sistema de armazenamento híbrido do Refocus (localStorage + Supabase)
import type { OnboardingData, UserProgress, DailyTask, MoodType } from './types';
import { isSupabaseConfigured } from './supabase';
import {
  createAnonymousUser,
  saveOnboardingData as saveOnboardingDB,
  initializeUserProgress as initProgressDB,
  createDailyTasks as createTasksDB,
  getUserProgress as getProgressDB,
  updateUserProgress as updateProgressDB,
  addMoodEntry as addMoodDB,
  getUserTasks as getTasksDB,
  toggleTaskCompletion as toggleTaskDB,
} from './database';

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

  // Salvar no banco de dados se configurado
  if (isSupabaseConfigured()) {
    const userId = await initializeUser();
    if (userId) {
      await saveOnboardingDB(userId, data);
      await initProgressDB(userId);
      await createTasksDB(userId);
    }
  }
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

export const getUserProgress = (): UserProgress | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
};

export const updateProgress = async (updates: Partial<UserProgress>): Promise<void> => {
  if (typeof window === 'undefined') return;

  const current = getUserProgress();
  if (current) {
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));

    // Atualizar no banco de dados se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        await updateProgressDB(userId, updates);
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
  }
};

export const getDailyTasks = (): DailyTask[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const toggleTaskCompletion = async (taskId: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  const tasks = getDailyTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    task.completed = !task.completed;

    // Atualiza pontos e tarefas completadas
    const progress = getUserProgress();
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

    // Atualizar no banco de dados se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        await toggleTaskDB(taskId, userId);
      }
    }
  }
};

export const updateStressLevel = async (level: number): Promise<void> => {
  await updateProgress({ stressLevel: level });
};

export const addMoodEntry = async (mood: MoodType): Promise<void> => {
  const progress = getUserProgress();
  if (progress) {
    progress.moodHistory.push({
      date: new Date(),
      mood,
    });
    await updateProgress(progress);

    // Salvar no banco de dados se configurado
    if (isSupabaseConfigured()) {
      const userId = getUserId();
      if (userId) {
        await addMoodDB(userId, mood);
      }
    }
  }
};

export const incrementDaysClean = async (): Promise<void> => {
  const progress = getUserProgress();
  if (progress) {
    progress.daysClean += 1;
    progress.currentStreak += 1;
    await updateProgress(progress);
  }
};

export const resetStreak = async (): Promise<void> => {
  const progress = getUserProgress();
  if (progress) {
    progress.lastRelapseDate = new Date();
    progress.currentStreak = 0;
    await updateProgress(progress);
  }
};

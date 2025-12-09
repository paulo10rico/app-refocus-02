// Tipos e interfaces do Refocus

export type SubstanceType = 'alcohol' | 'cigarette' | 'both';
export type GoalType = 'reduce' | 'quit';
export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface UserProfile {
  id: string;
  isAnonymous: boolean;
  name?: string;
  email?: string;
  createdAt: Date;
}

export interface OnboardingData {
  substanceType: SubstanceType;
  frequency: number; // vezes por semana
  duration: string; // há quanto tempo usa
  triggers: string[];
  goal: GoalType;
  motivation: string;
  currentMood: MoodType;
  completedAt: Date;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  emoji: string;
  duration: number; // em minutos
  points: number;
  completed: boolean;
  category: 'breathing' | 'meditation' | 'challenge' | 'journal' | 'exercise';
}

export interface UserProgress {
  daysClean: number;
  lastRelapseDate?: Date;
  totalPoints: number;
  completedTasks: number;
  currentStreak: number;
  stressLevel: number; // 0-10
  moodHistory: Array<{
    date: Date;
    mood: MoodType;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emoji?: string;
}

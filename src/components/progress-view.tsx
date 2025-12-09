'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Calendar, Award, Target, Flame } from 'lucide-react';
import { getUserProgress, getOnboarding } from '@/lib/storage';
import type { UserProgress, OnboardingData } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface ProgressViewProps {
  onBack: () => void;
}

export default function ProgressView({ onBack }: ProgressViewProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const progressData = getUserProgress();
    const onboardingData = getOnboarding();
    setProgress(progressData);
    setOnboarding(onboardingData);
  }, []);

  if (!progress || !onboarding) {
    return null;
  }

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      great: '😁',
      good: '🙂',
      neutral: '😐',
      bad: '😕',
      terrible: '😢',
    };
    return emojis[mood] || '😐';
  };

  const getGoalText = (goal: string) => {
    return goal === 'quit' ? 'Parar completamente' : 'Reduzir gradualmente';
  };

  const getSubstanceText = (type: string) => {
    const texts: Record<string, string> = {
      alcohol: '🍺 Álcool',
      cigarette: '🚬 Cigarro',
      both: '🍺🚬 Ambos',
    };
    return texts[type] || type;
  };

  // Calcular estatísticas
  const totalDaysInJourney = Math.floor(
    (new Date().getTime() - new Date(onboarding.completedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const successRate = totalDaysInJourney > 0 ? (progress.daysClean / totalDaysInJourney) * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100">
                Meu Progresso
              </h1>
              <p className="text-xs text-gray-500">Acompanhe sua evolução 📈</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Stats */}
        <Card className="p-8 bg-gradient-to-br from-purple-500 to-blue-500 text-white border-0">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {progress.daysClean} dias
            </h2>
            <p className="text-xl opacity-90">
              sem recaída! 🎉
            </p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-80">
              <Flame className="w-5 h-5" />
              <span>Sequência atual: {progress.currentStreak} dias</span>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {progress.totalPoints}
            </p>
            <p className="text-xs text-gray-500 mt-1">Pontos totais</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {progress.completedTasks}
            </p>
            <p className="text-xs text-gray-500 mt-1">Tarefas completas</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {totalDaysInJourney}
            </p>
            <p className="text-xs text-gray-500 mt-1">Dias na jornada</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {Math.round(successRate)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Taxa de sucesso</p>
          </Card>
        </div>

        {/* Seu Perfil */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Seu Perfil 👤
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Substância</span>
              <span className="font-semibold">{getSubstanceText(onboarding.substanceType)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Objetivo</span>
              <span className="font-semibold">{getGoalText(onboarding.goal)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Frequência anterior</span>
              <span className="font-semibold">{onboarding.frequency}x por semana</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Tempo de uso</span>
              <span className="font-semibold">{onboarding.duration}</span>
            </div>
          </div>
        </Card>

        {/* Gatilhos */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Seus Gatilhos 🎭
          </h3>
          <div className="flex flex-wrap gap-2">
            {onboarding.triggers.map((trigger, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800"
              >
                {trigger}
              </span>
            ))}
          </div>
        </Card>

        {/* Histórico de Humor */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Histórico de Humor 😊
          </h3>
          <div className="space-y-3">
            {progress.moodHistory.slice(-7).reverse().map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Conquistas */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Conquistas 🏆
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {progress.daysClean >= 1 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🌟</span>
                <p className="text-sm font-semibold">Primeiro Dia</p>
              </div>
            )}
            {progress.daysClean >= 7 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🎯</span>
                <p className="text-sm font-semibold">1 Semana</p>
              </div>
            )}
            {progress.daysClean >= 30 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
                <span className="text-3xl mb-2 block">💪</span>
                <p className="text-sm font-semibold">1 Mês</p>
              </div>
            )}
            {progress.completedTasks >= 10 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
                <span className="text-3xl mb-2 block">✅</span>
                <p className="text-sm font-semibold">10 Tarefas</p>
              </div>
            )}
            {progress.totalPoints >= 500 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
                <span className="text-3xl mb-2 block">⭐</span>
                <p className="text-sm font-semibold">500 Pontos</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

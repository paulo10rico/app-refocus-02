'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BreathingExerciseProps {
  onComplete: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const phaseDurations: Record<Phase, number> = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
  };

  const phaseMessages: Record<Phase, string> = {
    inhale: 'Inspire profundamente pelo nariz',
    hold: 'Segure o ar',
    exhale: 'Expire lentamente pela boca',
    rest: 'Descanse',
  };

  const phaseEmojis: Record<Phase, string> = {
    inhale: '🌬️',
    hold: '⏸️',
    exhale: '💨',
    rest: '😌',
  };

  const phaseColors: Record<Phase, string> = {
    inhale: 'from-cyan-400 to-blue-500',
    hold: 'from-yellow-400 to-orange-500',
    exhale: 'from-purple-400 to-pink-500',
    rest: 'from-green-400 to-emerald-500',
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });

      setPhaseTime((prev) => {
        const nextTime = prev + 1;
        const currentPhaseDuration = phaseDurations[phase];

        if (nextTime >= currentPhaseDuration) {
          // Muda para próxima fase
          const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];
          const currentIndex = phases.indexOf(phase);
          const nextPhase = phases[(currentIndex + 1) % phases.length];
          
          if (nextPhase === 'inhale') {
            setCycleCount((c) => c + 1);
          }
          
          setPhase(nextPhase);
          return 0;
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(60);
    setPhase('inhale');
    setPhaseTime(0);
    setCycleCount(0);
  };

  const handleFinish = () => {
    // Aqui você pode adicionar pontos ao usuário
    onComplete();
  };

  const progressPercentage = ((60 - timeLeft) / 60) * 100;
  const phaseProgress = (phaseTime / phaseDurations[phase]) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={timeLeft === 0 ? handleFinish : onComplete}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100">
                Exercício de Respiração
              </h1>
              <p className="text-xs text-gray-500">60 segundos de calma 🧘</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center space-y-8">
          {/* Timer Display */}
          <div className="space-y-4">
            <div className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-100">
              {timeLeft}s
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Breathing Circle */}
          <div className="flex items-center justify-center">
            <div
              className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center transition-all duration-1000 ${
                isActive ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'
              }`}
              style={{
                transform: `scale(${isActive ? 1 + phaseProgress / 200 : 1})`,
              }}
            >
              <div className="text-6xl md:text-8xl">
                {phaseEmojis[phase]}
              </div>
            </div>
          </div>

          {/* Phase Info */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {phaseMessages[phase]}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {phaseDurations[phase] - phaseTime}s restantes nesta fase
            </p>
            <Progress value={phaseProgress} className="h-1 max-w-xs mx-auto" />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-semibold">Ciclos completos</p>
              <p className="text-2xl font-bold text-purple-600">{cycleCount}</p>
            </div>
            <div>
              <p className="font-semibold">Fase atual</p>
              <p className="text-2xl font-bold text-blue-600 capitalize">{phase}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isActive && timeLeft > 0 && (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                {timeLeft === 60 ? 'Começar' : 'Continuar'}
              </Button>
            )}

            {isActive && (
              <Button
                onClick={handlePause}
                size="lg"
                variant="outline"
                className="px-8"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </Button>
            )}

            {timeLeft < 60 && (
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="px-8"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reiniciar
              </Button>
            )}

            {timeLeft === 0 && (
              <Button
                onClick={handleFinish}
                size="lg"
                className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8"
              >
                Concluir ✨
              </Button>
            )}
          </div>

          {/* Completion Message */}
          {timeLeft === 0 && (
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                Parabéns! 🎉
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Você completou o exercício de respiração!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                +50 pontos ganhos ⭐
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

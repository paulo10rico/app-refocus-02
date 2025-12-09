'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import type { SubstanceType, GoalType, MoodType, OnboardingData } from '@/lib/types';
import { saveOnboarding, initializeProgress } from '@/lib/storage';
import { Sparkles, Heart, Target, TrendingUp } from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: () => void;
}

const TRIGGERS_OPTIONS = [
  'Estresse no trabalho',
  'Problemas pessoais',
  'Festas e eventos sociais',
  'Solidão',
  'Ansiedade',
  'Tédio',
  'Pressão social',
  'Outros',
];

export default function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    triggers: [],
  });

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const completeOnboarding = () => {
    const onboardingData: OnboardingData = {
      substanceType: data.substanceType!,
      frequency: data.frequency!,
      duration: data.duration!,
      triggers: data.triggers!,
      goal: data.goal!,
      motivation: data.motivation!,
      currentMood: data.currentMood!,
      completedAt: new Date(),
    };
    
    saveOnboarding(onboardingData);
    initializeProgress();
    onComplete();
  };

  const toggleTrigger = (trigger: string) => {
    const current = data.triggers || [];
    if (current.includes(trigger)) {
      setData({ ...data, triggers: current.filter(t => t !== trigger) });
    } else {
      setData({ ...data, triggers: [...current, trigger] });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!data.substanceType;
      case 1: return !!data.frequency;
      case 2: return !!data.duration;
      case 3: return data.triggers && data.triggers.length > 0;
      case 4: return !!data.goal;
      case 5: return !!data.currentMood;
      case 6: return !!data.motivation;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Refocus
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Vamos conhecer você melhor
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Passo {step + 1} de {totalSteps}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 min-h-[300px]">
          {/* Step 0: Substance Type */}
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                O que você deseja reduzir ou parar? 🎯
              </h2>
              <RadioGroup
                value={data.substanceType}
                onValueChange={(value) => setData({ ...data, substanceType: value as SubstanceType })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="alcohol" id="alcohol" />
                  <Label htmlFor="alcohol" className="flex-1 cursor-pointer text-lg">
                    🍺 Álcool
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="cigarette" id="cigarette" />
                  <Label htmlFor="cigarette" className="flex-1 cursor-pointer text-lg">
                    🚬 Cigarro
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex-1 cursor-pointer text-lg">
                    🍺🚬 Ambos
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 1: Frequency */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Quantas vezes por semana você consome? 📊
              </h2>
              <RadioGroup
                value={data.frequency?.toString()}
                onValueChange={(value) => setData({ ...data, frequency: parseInt(value) })}
                className="space-y-3"
              >
                {[
                  { value: 1, label: '1-2 vezes' },
                  { value: 3, label: '3-4 vezes' },
                  { value: 5, label: '5-6 vezes' },
                  { value: 7, label: 'Todos os dias' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                    <RadioGroupItem value={option.value.toString()} id={`freq-${option.value}`} />
                    <Label htmlFor={`freq-${option.value}`} className="flex-1 cursor-pointer text-lg">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Há quanto tempo você usa? ⏰
              </h2>
              <RadioGroup
                value={data.duration}
                onValueChange={(value) => setData({ ...data, duration: value })}
                className="space-y-3"
              >
                {[
                  'Menos de 6 meses',
                  '6 meses a 1 ano',
                  '1 a 3 anos',
                  '3 a 5 anos',
                  'Mais de 5 anos',
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                    <RadioGroupItem value={option} id={`dur-${option}`} />
                    <Label htmlFor={`dur-${option}`} className="flex-1 cursor-pointer text-lg">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Triggers */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Quais são seus principais gatilhos? 🎭
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Selecione todos que se aplicam
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TRIGGERS_OPTIONS.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      data.triggers?.includes(trigger)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Qual é seu objetivo? 🎯
              </h2>
              <RadioGroup
                value={data.goal}
                onValueChange={(value) => setData({ ...data, goal: value as GoalType })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="reduce" id="reduce" />
                  <div className="flex-1">
                    <Label htmlFor="reduce" className="cursor-pointer text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Reduzir gradualmente
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Diminuir o consumo aos poucos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
                  <RadioGroupItem value="quit" id="quit" />
                  <div className="flex-1">
                    <Label htmlFor="quit" className="cursor-pointer text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Parar completamente
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Abstinência total
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Current Mood */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Como está seu humor hoje? 😊
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { value: 'terrible', emoji: '😢', label: 'Péssimo' },
                  { value: 'bad', emoji: '😕', label: 'Ruim' },
                  { value: 'neutral', emoji: '😐', label: 'Neutro' },
                  { value: 'good', emoji: '🙂', label: 'Bom' },
                  { value: 'great', emoji: '😁', label: 'Ótimo' },
                ].map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setData({ ...data, currentMood: mood.value as MoodType })}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      data.currentMood === mood.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Motivation */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Heart className="w-7 h-7 text-red-500" />
                O que te motiva a mudar? 💛✨
              </h2>
              <Textarea
                placeholder="Escreva aqui sua motivação... (ex: minha família, minha saúde, quero ser uma pessoa melhor...)"
                value={data.motivation || ''}
                onChange={(e) => setData({ ...data, motivation: e.target.value })}
                className="min-h-[150px] text-lg resize-none"
              />
              <p className="text-sm text-gray-500">
                Essa motivação será sua âncora nos momentos difíceis
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Voltar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {step === totalSteps - 1 ? 'Começar Jornada ✨' : 'Próximo'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

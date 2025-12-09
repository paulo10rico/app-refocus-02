'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/splash-screen';
import OnboardingQuiz from '@/components/onboarding-quiz';
import Dashboard from '@/components/dashboard';
import { hasCompletedOnboarding } from '@/lib/storage';
import { initializeNotifications } from '@/lib/notifications';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Verifica se já completou o onboarding
    const completed = hasCompletedOnboarding();
    if (completed) {
      setShowDashboard(true);
      setShowSplash(false);
    }

    // Inicializa sistema de notificações
    if (typeof window !== 'undefined') {
      initializeNotifications();
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    const completed = hasCompletedOnboarding();
    if (!completed) {
      setShowOnboarding(true);
    } else {
      setShowDashboard(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showOnboarding) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  if (showDashboard) {
    return <Dashboard />;
  }

  return null;
}

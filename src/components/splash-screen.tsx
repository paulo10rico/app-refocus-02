'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-6 animate-in zoom-in duration-700">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm animate-pulse">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          Refocus
        </h1>
        <p className="text-xl text-white/80 font-light">
          Sua jornada começa aqui ✨
        </p>
      </div>
    </div>
  );
}

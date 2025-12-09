'use client';

import { useState, useEffect } from 'react';
import { Home, MessageSquare, TrendingUp, User, Bell, Settings as SettingsIcon } from 'lucide-react';
import ChatAI from './chat-ai';
import ProgressView from './progress-view';
import BreathingExercise from './breathing-exercise';
import NotificationsSettings from './notifications-settings';
import { getUserProgress, getDailyTasks, toggleTaskCompletion, updateStressLevel, initializeProgress } from '@/lib/storage';
import type { UserProgress, DailyTask } from '@/lib/types';

type View = 'home' | 'chat' | 'progress' | 'profile' | 'breathing' | 'notifications';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [stressLevel, setStressLevel] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let userProgress = await getUserProgress();
    if (!userProgress) {
      await initializeProgress();
      userProgress = await getUserProgress();
    }
    setProgress(userProgress);
    setStressLevel(userProgress?.stressLevel || 5);
    const dailyTasks = await getDailyTasks();
    setTasks(dailyTasks || []);
  };

  const handleTaskToggle = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
    await loadData();
  };

  const handleStressChange = async (level: number) => {
    setStressLevel(level);
    await updateStressLevel(level);
    await loadData();
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatAI />;
      case 'progress':
        return <ProgressView />;
      case 'breathing':
        return <BreathingExercise onComplete={() => setCurrentView('home')} />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 Perfil</h1>
              <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    R
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Refocus User</h2>
                  <p className="text-gray-500">Membro desde hoje</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentView('notifications')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">Notificações</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button 
                    onClick={() => alert('⚙️ Configurações em breve! Aqui você poderá personalizar o app.')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <SettingsIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">Configurações</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button 
                    onClick={() => alert('🎯 Meus Objetivos em breve! Aqui você poderá definir e acompanhar suas metas.')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <span className="font-medium text-gray-800">Meus Objetivos</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button 
                    onClick={() => setCurrentView('progress')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <span className="font-medium text-gray-800">Estatísticas Detalhadas</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (confirm('🚪 Tem certeza que deseja sair?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🚪</span>
                      <span className="font-medium text-red-600">Sair</span>
                    </div>
                    <span className="text-red-400">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-[3rem] shadow-xl">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Olá, Refocus! 👋</h1>
                <p className="text-purple-100">Continue sua jornada de transformação</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{progress?.daysClean || 0}</div>
                  <div className="text-sm text-gray-600">Dias Limpos 🎯</div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{progress?.totalPoints || 0}</div>
                  <div className="text-sm text-gray-600">Pontos ⭐</div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-pink-600 mb-2">{progress?.completedTasks || 0}</div>
                  <div className="text-sm text-gray-600">Tarefas ✅</div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{stressLevel}/10</div>
                  <div className="text-sm text-gray-600">Estresse 😌</div>
                </div>
              </div>

              {/* Stress Level Slider */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Como está seu nível de estresse hoje?</h3>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => handleStressChange(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4ade80 0%, #facc15 50%, #ef4444 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>😌 Calmo</span>
                  <span>😰 Estressado</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Rápidas 🚀</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentView('breathing')}
                    className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-4xl mb-2">🌬️</div>
                    <div className="font-semibold">Respirar</div>
                    <div className="text-sm text-blue-100">60 segundos</div>
                  </button>
                  <button
                    onClick={() => setCurrentView('chat')}
                    className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-4xl mb-2">💬</div>
                    <div className="font-semibold">Conversar</div>
                    <div className="text-sm text-purple-100">Com a IA</div>
                  </button>
                </div>
              </div>

              {/* Daily Tasks */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tarefas de Hoje 📝</h2>
                <div className="space-y-3">
                  {Array.isArray(tasks) && tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskToggle(task.id)}
                      className={`bg-white rounded-3xl shadow-lg p-6 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{task.emoji}</div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.description}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                                {task.duration} min
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                +{task.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {task.completed && <span className="text-white text-xl">✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">💪</div>
                <p className="text-xl font-semibold mb-2">
                  "Cada dia limpo é uma vitória!"
                </p>
                <p className="text-purple-100">
                  Continue firme na sua jornada de transformação
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderView()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentView === 'home' ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentView === 'chat' ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-medium">Chat</span>
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentView === 'progress' ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentView === 'profile' ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, CheckCircle2, X } from 'lucide-react';

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  taskReminders: boolean;
  motivationalMessages: boolean;
  reminderTime: string;
}

export default function NotificationsSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminder: true,
    taskReminders: true,
    motivationalMessages: true,
    reminderTime: '09:00',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('refocus_notifications');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleTimeChange = (time: string) => {
    const newSettings = { ...settings, reminderTime: time };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refocus_notifications', JSON.stringify(newSettings));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleToggle('enabled');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔔 Notificações</h1>
          <p className="text-gray-600">Configure lembretes para manter seu foco</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-300 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Configurações salvas!</span>
          </div>
        )}

        {/* Main Toggle */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {settings.enabled ? (
                <Bell className="w-8 h-8 text-purple-600" />
              ) : (
                <BellOff className="w-8 h-8 text-gray-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Ativar Notificações</h3>
                <p className="text-sm text-gray-500">Receba lembretes e mensagens motivacionais</p>
              </div>
            </div>
            <button
              onClick={settings.enabled ? () => handleToggle('enabled') : requestPermission}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                settings.enabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  settings.enabled ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Types */}
        {settings.enabled && (
          <div className="space-y-4">
            {/* Daily Reminder */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Lembrete Diário</h3>
                    <p className="text-sm text-gray-500">Receba um lembrete todos os dias</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('dailyReminder')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.dailyReminder ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      settings.dailyReminder ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              
              {settings.dailyReminder && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário do lembrete
                  </label>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Task Reminders */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Lembretes de Tarefas</h3>
                    <p className="text-sm text-gray-500">Notificações para tarefas pendentes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('taskReminders')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.taskReminders ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      settings.taskReminders ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Motivational Messages */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">💪</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Mensagens Motivacionais</h3>
                    <p className="text-sm text-gray-500">Frases inspiradoras ao longo do dia</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('motivationalMessages')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.motivationalMessages ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      settings.motivationalMessages ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Dica:</strong> Notificações ajudam você a manter o foco e não esquecer suas tarefas diárias. 
            Configure os horários que funcionam melhor para você!
          </p>
        </div>
      </div>
    </div>
  );
}

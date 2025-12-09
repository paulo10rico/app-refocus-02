// Utilitários para notificações do Refocus

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  taskReminders: boolean;
  motivationalMessages: boolean;
  reminderTime: string;
}

export const getNotificationSettings = (): NotificationSettings | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('refocus_notifications');
  return data ? JSON.parse(data) : null;
};

export const scheduleNotification = (title: string, body: string, delay: number = 0) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
      });
    }, delay);
  }
};

export const scheduleDailyReminder = () => {
  const settings = getNotificationSettings();
  if (!settings || !settings.enabled || !settings.dailyReminder) return;

  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    scheduleNotification(
      '🎯 Refocus - Lembrete Diário',
      'Não esqueça de completar suas tarefas hoje! Você está indo muito bem! 💪'
    );
    scheduleDailyReminder(); // Reagendar para o próximo dia
  }, delay);
};

export const sendTaskReminder = (taskTitle: string) => {
  const settings = getNotificationSettings();
  if (!settings || !settings.enabled || !settings.taskReminders) return;

  scheduleNotification(
    '✅ Tarefa Pendente',
    `Você ainda não completou: ${taskTitle}`
  );
};

export const sendMotivationalMessage = () => {
  const settings = getNotificationSettings();
  if (!settings || !settings.enabled || !settings.motivationalMessages) return;

  const messages = [
    'Você está fazendo um trabalho incrível! Continue assim! 💪',
    'Cada dia limpo é uma vitória! Celebre seu progresso! 🎉',
    'Lembre-se: você é mais forte do que pensa! 💎',
    'Sua jornada inspira outras pessoas! Continue brilhando! ✨',
    'Orgulhe-se de cada pequeno passo! Você está evoluindo! 🚀',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  scheduleNotification('💛 Mensagem Motivacional', randomMessage);
};

export const initializeNotifications = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    scheduleDailyReminder();
    
    // Enviar mensagens motivacionais aleatórias (3x por dia)
    setInterval(() => {
      sendMotivationalMessage();
    }, 8 * 60 * 60 * 1000); // A cada 8 horas
  }
};

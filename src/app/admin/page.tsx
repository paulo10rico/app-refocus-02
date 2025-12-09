'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, CheckCircle, Activity, Calendar, Award, MessageSquare, Settings } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  averageDaysClean: number;
  totalTasksCompleted: number;
  averageStressLevel: number;
  retentionRate: number;
}

interface UserData {
  id: string;
  daysClean: number;
  totalPoints: number;
  completedTasks: number;
  stressLevel: number;
  lastActive: string;
}

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeToday: 0,
    averageDaysClean: 0,
    totalTasksCompleted: 0,
    averageStressLevel: 0,
    retentionRate: 0,
  });

  const [users, setUsers] = useState<UserData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');

  useEffect(() => {
    // Simular dados do admin (em produção, viria de uma API)
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Dados simulados para demonstração
    setStats({
      totalUsers: 1247,
      activeToday: 892,
      averageDaysClean: 23,
      totalTasksCompleted: 8934,
      averageStressLevel: 4.2,
      retentionRate: 78.5,
    });

    setUsers([
      {
        id: '1',
        daysClean: 45,
        totalPoints: 3450,
        completedTasks: 89,
        stressLevel: 3,
        lastActive: '2 horas atrás',
      },
      {
        id: '2',
        daysClean: 12,
        totalPoints: 1200,
        completedTasks: 34,
        stressLevel: 6,
        lastActive: '5 horas atrás',
      },
      {
        id: '3',
        daysClean: 78,
        totalPoints: 6780,
        completedTasks: 156,
        stressLevel: 2,
        lastActive: '1 hora atrás',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🛠️ Painel Administrativo</h1>
          <p className="text-purple-200">Gerencie usuários, métricas e conteúdo do Refocus</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            👥 Usuários
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'content'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📝 Conteúdo
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Users */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Total de Usuários</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% este mês</span>
                </div>
              </div>

              {/* Active Today */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Ativos Hoje</p>
                    <p className="text-3xl font-bold text-white">{stats.activeToday}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <span>{((stats.activeToday / stats.totalUsers) * 100).toFixed(1)}% dos usuários</span>
                </div>
              </div>

              {/* Average Days Clean */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Média de Dias Limpos</p>
                    <p className="text-3xl font-bold text-white">{stats.averageDaysClean}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5 dias vs mês anterior</span>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Tarefas Completadas</p>
                    <p className="text-3xl font-bold text-white">{stats.totalTasksCompleted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-300 text-sm">
                  <span>Média de 7.2 por usuário</span>
                </div>
              </div>

              {/* Average Stress */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Nível de Estresse Médio</p>
                    <p className="text-3xl font-bold text-white">{stats.averageStressLevel}/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <span>-0.8 vs mês anterior</span>
                </div>
              </div>

              {/* Retention Rate */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Taxa de Retenção</p>
                    <p className="text-3xl font-bold text-white">{stats.retentionRate}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+3.2% este mês</span>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">📈 Crescimento de Usuários (30 dias)</h3>
              <div className="h-64 flex items-center justify-center text-purple-200">
                <p>Gráfico de crescimento será implementado aqui</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">👥 Usuários Recentes</h3>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        U{user.id}
                      </div>
                      <div>
                        <p className="text-white font-semibold">Usuário #{user.id}</p>
                        <p className="text-purple-200 text-sm">Último acesso: {user.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-purple-200">Dias Limpos</p>
                        <p className="text-white font-bold text-lg">{user.daysClean}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-200">Pontos</p>
                        <p className="text-white font-bold text-lg">{user.totalPoints}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-200">Tarefas</p>
                        <p className="text-white font-bold text-lg">{user.completedTasks}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-200">Estresse</p>
                        <p className="text-white font-bold text-lg">{user.stressLevel}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">📝 Gerenciar Conteúdo</h3>
              <div className="space-y-4">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Adicionar Frase Motivacional
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Criar Nova Tarefa
                </button>
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
                  <Settings className="w-5 h-5" />
                  Configurar Notificações Globais
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

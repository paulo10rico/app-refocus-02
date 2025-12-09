'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Sparkles, Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';
import { analyzeUserMessage, type AIAnalysis } from '@/lib/openai';
import { saveChatMessage, getChatHistory } from '@/lib/database';
import { getOnboarding, getUserProgress } from '@/lib/storage';

interface ChatAIProps {
  onBack: () => void;
}

export default function ChatAI({ onBack }: ChatAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou a Dra. Sofia, sua psicóloga IA. Estou aqui para te apoiar nessa jornada de forma profunda e personalizada. Como você está se sentindo hoje?',
      timestamp: new Date(),
      emoji: '💙',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Carregar ID do usuário do localStorage
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('refocus_user_id');
      setUserId(storedUserId);

      // Carregar histórico de chat se tiver userId
      if (storedUserId) {
        loadChatHistory(storedUserId);
      }
    }
  }, []);

  const loadChatHistory = async (uid: string) => {
    const history = await getChatHistory(uid);
    if (history && history.length > 0) {
      const formattedHistory = history.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        emoji: msg.emoji,
      }));
      setMessages(formattedHistory);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Preparar contexto do usuário
      const onboarding = getOnboarding();
      const progress = getUserProgress();

      const userContext = {
        substanceType: onboarding?.substanceType,
        daysClean: progress?.daysClean,
        recentMood: onboarding?.currentMood,
        triggers: onboarding?.triggers,
      };

      // Preparar histórico de conversa
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Chamar OpenAI com análise detalhada
      const { response, analysis } = await analyzeUserMessage(
        input,
        conversationHistory,
        userContext
      );

      setCurrentAnalysis(analysis);

      // Adicionar emoji baseado no sentimento
      let emoji = '💙';
      if (analysis.sentiment === 'positive') emoji = '🌟';
      if (analysis.sentiment === 'negative') emoji = '💛';
      if (analysis.sentiment === 'critical') emoji = '🆘';
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') emoji = '⚠️';

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        emoji,
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Salvar no banco de dados se tiver userId
      if (userId) {
        await saveChatMessage(userId, 'user', input);
        await saveChatMessage(userId, 'assistant', response, emoji, analysis);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);

      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema técnico. Mas estou aqui para você! 💙 Pode tentar novamente?',
        timestamp: new Date(),
        emoji: '💙',
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
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
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800 dark:text-gray-100">
                  Dra. Sofia - Psicóloga IA
                </h1>
                <p className="text-xs text-gray-500">Análise profunda e personalizada 💙</p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      {currentAnalysis && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Estado Emocional:
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {currentAnalysis.emotionalState}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-2">
                    Risco:
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(currentAnalysis.riskLevel)}`}>
                    {currentAnalysis.riskLevel === 'low' && '🟢 Baixo'}
                    {currentAnalysis.riskLevel === 'medium' && '🟡 Médio'}
                    {currentAnalysis.riskLevel === 'high' && '🟠 Alto'}
                    {currentAnalysis.riskLevel === 'critical' && '🔴 Crítico'}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-2">
                    Urgência: {currentAnalysis.urgency}/10
                  </span>
                </div>

                {currentAnalysis.triggers.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Gatilhos detectados:
                    </span>
                    {currentAnalysis.triggers.map((trigger, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}

                {currentAnalysis.recommendations.length > 0 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Recomendações: </span>
                    {currentAnalysis.recommendations.join(' • ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.role === 'assistant' && message.emoji && (
                  <span className="text-xl mr-2">{message.emoji}</span>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Compartilhe seus sentimentos, pensamentos ou desafios..."
              className="resize-none min-h-[60px] max-h-[120px]"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-[60px] px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Análise profunda com IA • Pressione Enter para enviar • Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}

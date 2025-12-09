import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Para uso no cliente
});

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  emotionalState: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  recommendations: string[];
  urgency: number; // 0-10
  supportNeeded: boolean;
}

export async function analyzeUserMessage(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: {
    substanceType?: string;
    daysClean?: number;
    recentMood?: string;
    triggers?: string[];
  }
): Promise<{ response: string; analysis: AIAnalysis }> {
  try {
    // Prompt detalhado para análise profunda
    const systemPrompt = `Você é uma psicóloga especializada em dependência química e saúde mental, com foco em abstinência de álcool e cigarro. Seu nome é Dra. Sofia.

CONTEXTO DO USUÁRIO:
${userContext ? `
- Substância: ${userContext.substanceType || 'não especificado'}
- Dias limpo: ${userContext.daysClean || 0}
- Humor recente: ${userContext.recentMood || 'não registrado'}
- Gatilhos conhecidos: ${userContext.triggers?.join(', ') || 'não identificados'}
` : 'Contexto não disponível'}

SUAS RESPONSABILIDADES:
1. Analisar profundamente o estado emocional e psicológico do usuário
2. Identificar sinais de risco de recaída (palavras-chave, tom, contexto)
3. Detectar gatilhos emocionais e situacionais
4. Oferecer suporte empático e estratégias práticas
5. Recomendar ações imediatas quando necessário
6. Usar emojis de forma natural e empática

ANÁLISE DETALHADA:
- Sentimento geral (positivo, neutro, negativo, crítico)
- Estado emocional específico
- Nível de risco de recaída (baixo, médio, alto, crítico)
- Gatilhos identificados na mensagem
- Recomendações personalizadas
- Urgência de intervenção (0-10)
- Se precisa de suporte adicional

ESTILO DE COMUNICAÇÃO:
- Empática e acolhedora
- Use emojis naturalmente (💙, 💪, 🌟, 😌, 🎯, etc)
- Respostas entre 2-4 frases (concisa mas completa)
- Perguntas abertas para engajar
- Validação de sentimentos
- Estratégias práticas e acionáveis
- Tom motivacional mas realista

SITUAÇÕES CRÍTICAS (responda com urgência):
- Menção de vontade forte de recaída
- Sinais de crise emocional
- Pensamentos autodestrutivos
- Isolamento social extremo
- Perda de esperança

Responda de forma natural, como uma psicóloga experiente e carinhosa.`;

    // Preparar histórico de conversa
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Chamar OpenAI para resposta
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode tentar novamente?';

    // Chamar OpenAI para análise estruturada
    const analysisCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um sistema de análise psicológica. Analise a mensagem do usuário e retorne APENAS um JSON válido com a seguinte estrutura:
{
  "sentiment": "positive" | "neutral" | "negative" | "critical",
  "emotionalState": "descrição breve do estado emocional",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "triggers": ["gatilho1", "gatilho2"],
  "recommendations": ["recomendação1", "recomendação2"],
  "urgency": 0-10,
  "supportNeeded": true | false
}

Contexto: ${JSON.stringify(userContext)}
Mensagem do usuário: "${message}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    let analysis: AIAnalysis;
    try {
      analysis = JSON.parse(analysisCompletion.choices[0]?.message?.content || '{}');
    } catch {
      // Análise padrão se falhar o parse
      analysis = {
        sentiment: 'neutral',
        emotionalState: 'Processando...',
        riskLevel: 'low',
        triggers: [],
        recommendations: ['Continue conversando comigo', 'Pratique respiração profunda'],
        urgency: 3,
        supportNeeded: false,
      };
    }

    return { response, analysis };
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    
    // Fallback para resposta local
    return {
      response: 'Estou tendo dificuldades técnicas no momento, mas estou aqui para você. 💙 Pode me contar mais sobre como está se sentindo?',
      analysis: {
        sentiment: 'neutral',
        emotionalState: 'Aguardando mais informações',
        riskLevel: 'low',
        triggers: [],
        recommendations: ['Continue o diálogo', 'Compartilhe seus sentimentos'],
        urgency: 2,
        supportNeeded: false,
      },
    };
  }
}

export async function generateDailyInsight(userProgress: {
  daysClean: number;
  completedTasks: number;
  recentMood: string;
  substanceType: string;
}): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é uma psicóloga motivacional. Gere uma mensagem inspiradora e personalizada (2-3 frases) baseada no progresso do usuário.',
        },
        {
          role: 'user',
          content: `Gere uma mensagem motivacional para:
- ${userProgress.daysClean} dias limpo
- ${userProgress.completedTasks} tarefas completadas
- Humor: ${userProgress.recentMood}
- Substância: ${userProgress.substanceType}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || '🌟 Continue firme! Cada dia é uma vitória!';
  } catch {
    return '🌟 Você está fazendo um trabalho incrível! Continue assim! 💪';
  }
}

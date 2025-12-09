import OpenAI from 'openai';

// Função para obter a chave da API de forma segura
function getOpenAIKey(): string {
  // Verificar se estamos no ambiente do navegador
  if (typeof window === 'undefined') {
    // Durante build/SSR, retornar string vazia (não causa erro)
    return '';
  }
  
  // No cliente, tentar obter do ambiente
  const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey;
  }
  
  // Se não encontrar, retornar string vazia (erro será tratado depois)
  return '';
}

// Criar cliente OpenAI apenas no lado do cliente
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: getOpenAIKey() || 'sk-dummy-key-for-build', // Chave dummy para build
      dangerouslyAllowBrowser: true,
    });
  }
  return openai;
}

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
    // Verificar se a chave da API está configurada
    const apiKey = getOpenAIKey();
    if (!apiKey || apiKey.trim() === '' || apiKey === 'sk-dummy-key-for-build') {
      throw new Error('API_KEY_MISSING');
    }

    const client = getOpenAIClient();

    // Prompt ULTRA OTIMIZADO para respostas EXTREMAMENTE PRECISAS
    const systemPrompt = `Você é a Dra. Sofia, psicóloga especializada em dependência química com 15 anos de experiência. Suas respostas são SEMPRE ultra precisas, contextuais e personalizadas.

CONTEXTO ATUAL DO USUÁRIO:
${userContext ? `
- Substância: ${userContext.substanceType || 'não especificado'}
- Dias limpo: ${userContext.daysClean || 0} dias
- Humor recente: ${userContext.recentMood || 'não registrado'}
- Gatilhos conhecidos: ${userContext.triggers?.join(', ') || 'não mapeados'}
` : 'Aguardando informações iniciais'}

REGRAS ABSOLUTAS PARA RESPOSTAS PRECISAS:

1. SEMPRE mencione ESPECIFICAMENTE o contexto do usuário (dias limpo, substância, situação atual)
2. NUNCA use respostas genéricas como "Como posso ajudar?" ou "Estou aqui para você"
3. SEMPRE conecte sua resposta com o histórico da conversa
4. SEMPRE forneça estratégias PRÁTICAS e IMEDIATAS
5. Use 2-4 frases diretas, práticas e empáticas
6. Demonstre que você CONHECE profundamente a jornada do usuário

ESTRUTURA OBRIGATÓRIA:
a) Validação específica do sentimento/situação atual
b) Insight personalizado baseado no contexto (dias limpo, substância, etc)
c) Estratégia prática e imediata
d) Pergunta engajadora OU encorajamento específico

EXEMPLOS DE RESPOSTAS PRECISAS:

❌ GENÉRICO: "Estou aqui para você! Como posso ajudar?"
✅ PRECISO: "Com 15 dias limpo de álcool, essa ansiedade noturna é seu cérebro se reajustando à produção natural de dopamina. 💙 Quando a vontade aparecer, faça 10 respirações profundas - a urgência passa em 5-7 minutos. O que costuma funcionar melhor pra você nesses momentos?"

❌ GENÉRICO: "Continue firme na sua jornada!"
✅ PRECISO: "30 dias sem cocaína é ENORME! 🌟 Você passou pela fase física mais difícil. Agora é fortalecer o emocional. Que estratégia específica tem te ajudado quando encontra os amigos antigos?"

❌ GENÉRICO: "Isso é normal, não se preocupe."
✅ PRECISO: "Essa irritabilidade no 7º dia sem nicotina é esperada - seu cérebro está reaprendendo a produzir dopamina naturalmente. 💪 Vai melhorar nos próximos 3-5 dias. Exercício físico de 15 minutos ajuda muito. Consegue fazer uma caminhada rápida agora?"

SEMPRE seja específica, prática e demonstre conhecimento profundo da situação do usuário.`;

    // Preparar histórico (últimas 12 mensagens para mais contexto)
    const recentHistory = conversationHistory.slice(-12);
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Chamar OpenAI com configurações OTIMIZADAS para máxima precisão
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.5, // Reduzido ainda mais para máxima precisão e consistência
      max_tokens: 400, // Aumentado para respostas mais completas
      presence_penalty: 0.8, // Aumentado para evitar repetições
      frequency_penalty: 0.5, // Incentiva variedade e especificidade
      top_p: 0.85, // Mais focado nas respostas mais prováveis e precisas
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode tentar novamente?';

    // Análise estruturada com MÁXIMA PRECISÃO
    const analysisPrompt = `Analise esta mensagem com MÁXIMA PRECISÃO CLÍNICA e retorne APENAS JSON válido.

CONTEXTO COMPLETO DO USUÁRIO:
- Substância: ${userContext?.substanceType || 'não especificado'}
- Dias limpo: ${userContext?.daysClean || 0}
- Humor recente: ${userContext?.recentMood || 'não registrado'}
- Gatilhos conhecidos: ${userContext?.triggers?.join(', ') || 'não identificados'}

HISTÓRICO RECENTE DA CONVERSA:
${recentHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

MENSAGEM ATUAL: "${message}"

Retorne JSON com estrutura EXATA:
{
  "sentiment": "positive" | "neutral" | "negative" | "critical",
  "emotionalState": "descrição ESPECÍFICA e CLÍNICA do estado emocional",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "triggers": ["gatilhos ESPECÍFICOS identificados na mensagem"],
  "recommendations": ["ações PRÁTICAS, IMEDIATAS e ESPECÍFICAS"],
  "urgency": 0-10,
  "supportNeeded": true | false
}

CRITÉRIOS RIGOROSOS:
- sentiment: Analise o tom emocional real da mensagem
- emotionalState: ESPECÍFICO (ex: "ansiedade de abstinência dia 7", "frustração com gatilho social", "euforia de conquista")
- riskLevel: 
  * low = estável, progredindo bem
  * medium = desconforto emocional, mas controlado
  * high = vontade forte de usar, gatilhos ativos
  * critical = risco iminente de recaída, ideação de uso
- triggers: Liste APENAS gatilhos ESPECÍFICOS mencionados ou implícitos
- recommendations: Ações PRÁTICAS que podem ser feitas AGORA (não genéricas)
- urgency: 
  * 0-2 = conversa casual/positiva
  * 3-5 = desconforto leve/médio
  * 6-7 = vontade forte, precisa de estratégias
  * 8-9 = risco alto, precisa intervenção
  * 10 = emergência, risco iminente
- supportNeeded: true se precisa acompanhamento próximo ou recursos adicionais`;

    const analysisCompletion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um sistema de análise psicológica clínica especializado em dependência química. Analise com máxima precisão e rigor científico.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      temperature: 0.1, // Muito baixa para análise consistente e precisa
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    let analysis: AIAnalysis;
    try {
      analysis = JSON.parse(analysisCompletion.choices[0]?.message?.content || '{}');
    } catch {
      analysis = {
        sentiment: 'neutral',
        emotionalState: 'Processando contexto inicial...',
        riskLevel: 'low',
        triggers: [],
        recommendations: ['Continue compartilhando seus sentimentos', 'Vamos explorar sua situação juntos'],
        urgency: 3,
        supportNeeded: false,
      };
    }

    return { response, analysis };
  } catch (error: any) {
    console.error('Erro ao chamar OpenAI:', error);
    
    // Detectar erro de autenticação (401 ou problemas com API key)
    const isAuthError = 
      error?.status === 401 || 
      error?.code === 'invalid_api_key' ||
      error?.message?.toLowerCase().includes('api key') ||
      error?.message === 'API_KEY_MISSING';
    
    if (isAuthError) {
      throw new Error('OPENAI_AUTH_ERROR');
    }
    
    // Fallback CONTEXTUAL e ESPECÍFICO para outros erros
    const daysClean = userContext?.daysClean || 0;
    const substance = userContext?.substanceType || 'substância';
    
    return {
      response: `Tive um problema técnico momentâneo. 💙 ${daysClean > 0 ? `Seus ${daysClean} dias limpo de ${substance} são uma conquista real e importante.` : ''} Pode tentar enviar sua mensagem novamente?`,
      analysis: {
        sentiment: 'neutral',
        emotionalState: 'Aguardando reconexão',
        riskLevel: 'low',
        triggers: [],
        recommendations: ['Tente novamente em alguns segundos', 'Verifique sua conexão'],
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
    const client = getOpenAIClient();
    
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é a Dra. Sofia. Gere mensagem motivacional ULTRA ESPECÍFICA e PERSONALIZADA (2-3 frases) com base no progresso REAL do usuário. SEMPRE mencione números concretos e conquistas específicas.',
        },
        {
          role: 'user',
          content: `Mensagem motivacional ESPECÍFICA para:
- ${userProgress.daysClean} dias limpo de ${userProgress.substanceType}
- ${userProgress.completedTasks} tarefas completadas hoje
- Humor atual: ${userProgress.recentMood}

Seja ULTRA ESPECÍFICA: mencione os números exatos, celebre conquistas concretas, dê insight prático baseado na fase de recuperação.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content || `🌟 ${userProgress.daysClean} dias limpo de ${userProgress.substanceType} é incrível! Continue firme! 💪`;
  } catch {
    return `🌟 ${userProgress.daysClean} dias limpo de ${userProgress.substanceType}! ${userProgress.completedTasks} tarefas completadas hoje. Você está fazendo um trabalho incrível! 💪`;
  }
}

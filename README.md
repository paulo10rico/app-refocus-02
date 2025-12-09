# 🧘‍♂️ Refocus - Seu Companheiro de Recuperação

> Aplicativo completo de apoio à recuperação de vícios com IA avançada, gamificação e suporte psicológico 24/7.

## ✨ Funcionalidades Principais

### 🤖 **IA Psicóloga Avançada**
- Chat inteligente com análise profunda usando GPT-4
- Detecção automática de sentimentos e emoções
- Recomendações personalizadas baseadas no contexto
- Histórico completo de conversas salvo no banco

### 📊 **Dashboard Completo**
- Acompanhamento de dias limpos em tempo real
- Monitoramento de nível de estresse (0-10)
- Sistema de pontuação e recompensas
- Visualização de progresso e conquistas

### ✅ **Sistema de Tarefas Gamificado**
- 6 categorias de tarefas diárias
- Sistema de pontos e níveis
- Tarefas personalizadas por categoria
- Acompanhamento de conclusão

### 🧘 **Exercício de Respiração Guiado**
- Técnica 4-7-8 para redução de estresse
- Timer visual de 60 segundos
- Instruções passo a passo
- Integrado ao dashboard

### 🔔 **Sistema de Notificações**
- Lembretes diários personalizáveis
- Notificações de tarefas pendentes
- Mensagens motivacionais automáticas
- Configurações salvas automaticamente

### 👨‍💼 **Painel Administrativo**
- Dashboard com métricas importantes
- Visualização de usuários
- Gerenciamento de conteúdo
- Design dark mode profissional

## 🗄️ **Banco de Dados Completo**

### Tabelas Implementadas:
- ✅ **users** - Gerenciamento de usuários
- ✅ **onboarding** - Dados de integração inicial
- ✅ **progress** - Acompanhamento de progresso
- ✅ **mood_history** - Histórico de humor
- ✅ **tasks** - Sistema de tarefas
- ✅ **chat_history** - Histórico de conversas com IA

### Recursos do Banco:
- 🔐 Row Level Security (RLS) configurado
- 📈 Índices otimizados para performance
- 🔄 Sistema híbrido (localStorage + Supabase)
- 💾 Sincronização automática

## 🚀 Como Começar

### 1️⃣ **Conectar Supabase**

**Opção A: Via OAuth (Recomendado)**
1. Vá em **Configurações do Projeto** → **Integrações**
2. Clique em **Conectar Supabase**
3. Autorize a conexão
4. Pronto! Variáveis configuradas automaticamente ✅

**Opção B: Manual**
1. Acesse https://supabase.com/dashboard
2. Vá em **Settings** → **API**
3. Copie a **Project URL** e **anon public key**
4. Adicione nas variáveis de ambiente da Lasy

### 2️⃣ **Criar Tabelas no Banco**

Acesse o **SQL Editor** no Supabase e execute o script completo em `SETUP-DATABASE.md`

Ou me avise aqui no chat que você conectou o Supabase e **EU EXECUTO AUTOMATICAMENTE** para você! 🚀

### 3️⃣ **Configurar OpenAI (Opcional)**

Para ativar a análise profunda da IA:
1. Acesse https://platform.openai.com
2. Crie uma API Key
3. Adicione nas variáveis de ambiente:
   - Nome: `NEXT_PUBLIC_OPENAI_API_KEY`
   - Valor: `sk-...`

## 🎨 Design e UX

- 🎨 Interface minimalista e moderna
- 🌈 Gradientes roxo/rosa para identidade visual
- 📱 Totalmente responsivo (mobile-first)
- ✨ Animações suaves e transições
- 🌙 Suporte a modo escuro

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Supabase** - Banco de dados e autenticação
- **OpenAI GPT-4** - IA avançada
- **Lucide Icons** - Ícones modernos

## 📋 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal
│   ├── admin/page.tsx        # Painel administrativo
│   └── layout.tsx            # Layout global
├── components/
│   ├── breathing-exercise.tsx    # Exercício de respiração
│   ├── chat-ai.tsx              # Chat com IA
│   ├── dashboard.tsx            # Dashboard principal
│   ├── notifications-settings.tsx # Configurações de notificações
│   └── progress-view.tsx        # Visualização de progresso
└── lib/
    ├── database.ts           # Funções do banco
    ├── notifications.ts      # Sistema de notificações
    ├── openai.ts            # Integração OpenAI
    ├── storage.ts           # Sistema híbrido de storage
    └── supabase.ts          # Cliente Supabase
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Variáveis de ambiente protegidas
- ✅ Validação de dados no backend
- ✅ Políticas de acesso configuradas

## 📈 Próximos Passos

Após conectar o Supabase e configurar a OpenAI:

1. ✅ Teste o chat com a IA
2. ✅ Complete algumas tarefas diárias
3. ✅ Configure suas notificações
4. ✅ Explore o painel administrativo
5. ✅ Acompanhe seu progresso

## 🆘 Suporte

Se tiver problemas:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que as tabelas foram criadas no Supabase
3. Verifique o console do navegador para erros
4. Consulte `SETUP-DATABASE.md` para instruções detalhadas

## 💜 Sobre o Refocus

O Refocus foi criado para ser seu companheiro de confiança na jornada de recuperação. Com tecnologia de ponta e uma abordagem centrada no usuário, oferecemos suporte 24/7 através de IA avançada, gamificação motivadora e ferramentas práticas para o dia a dia.

**Sua jornada de recuperação começa aqui.** 🚀💜

---

**Desenvolvido com 💜 usando Next.js, Supabase e OpenAI**

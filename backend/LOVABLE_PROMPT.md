# 🃏 PROMPT PARA LOVABLE - PAINEL ADMIN ACES POKER

## 📋 DESCRIÇÃO DO PROJETO

Crie um painel administrativo moderno e responsivo para o sistema de gestão de torneios de poker **Aces Poker**. O sistema gerencia temporadas de poker onde cada temporada possui 12 torneios, e ao final de cada temporada é gerado um ranking TOP20 dos jogadores baseado na soma das pontuações de todos os torneios.

## 🎯 REGRA DE NEGÓCIO PRINCIPAL

- **1 Temporada = 12 Torneios máximo**
- **Ranking automático**: Sistema calcula automaticamente o ranking somando pontos de todos os torneios da temporada
- **TOP20 por temporada**: Exibe os 20 melhores jogadores da temporada atual
- **Admin só registra**: O admin apenas registra as pontuações dos jogadores em cada torneio, o sistema faz todo o resto automaticamente

## 🔧 BACKEND EXISTENTE

### API Base
```
URL: http://localhost:3001/api
Autenticação: JWT Bearer Token
```

### 🔐 Autenticação
```bash
POST /api/auth/login
{
  "email": "davicunha544@gmail.com", 
  "password": "Copef1957@"
}
```

### 📊 ENDPOINTS PRINCIPAIS

#### 1. **TEMPORADAS**
```bash
GET /api/temporadas                    # Listar todas temporadas
GET /api/temporadas/current            # Temporada atual
GET /api/temporadas/:id                # Detalhes da temporada
GET /api/temporadas/:id/ranking        # TOP20 da temporada
POST /api/temporadas/:id/calculate-ranking  # Recalcular ranking
POST /api/temporadas                   # Criar nova temporada
PATCH /api/temporadas/:id              # Atualizar temporada
```

#### 2. **TORNEIOS**  
```bash
GET /api/torneios                      # Listar todos torneios
GET /api/torneios/temporada/:id        # Torneios de uma temporada
GET /api/torneios/:id                  # Detalhes do torneio
GET /api/torneios/:id/participacoes    # Participações do torneio
POST /api/torneios                     # Criar torneio
POST /api/torneios/:id/participacoes   # Adicionar participação
PATCH /api/torneios/:torneioId/participacoes/:jogadorId  # Atualizar pontuação
DELETE /api/torneios/:torneioId/participacoes/:jogadorId # Remover participação
```

#### 3. **JOGADORES**
```bash
GET /api/jogadores                     # Listar jogadores
GET /api/jogadores/stats               # Jogadores com estatísticas
GET /api/jogadores/top-winners         # Top vencedores
GET /api/jogadores/most-active         # Mais ativos
GET /api/jogadores/:id                 # Detalhes do jogador
GET /api/jogadores/:id/history         # Histórico do jogador
POST /api/jogadores                    # Criar jogador
PATCH /api/jogadores/:id               # Atualizar jogador
```

#### 4. **GALERIA DE FOTOS**
```bash
GET /api/fotos/galeria                 # Galeria organizada
GET /api/fotos/hall-da-fama           # Fotos dos campeões
GET /api/fotos/melhores-momentos      # Melhores momentos
GET /api/fotos/temporadas             # Fotos da temporada
POST /api/fotos                       # Upload foto
```

#### 5. **ADMINS**
```bash
GET /api/admin                        # Listar admins
POST /api/admin                       # Criar admin
PATCH /api/admin/:id                  # Atualizar admin
```

## 🎨 ESTRUTURA DO PAINEL ADMIN

### 📱 Layout Responsivo
- **Header**: Logo Aces Poker + Menu + Logout
- **Sidebar**: Navegação principal colapsável
- **Main Content**: Área principal com breadcrumbs
- **Footer**: Copyright e versão

### 🧭 NAVEGAÇÃO PRINCIPAL

1. **📊 Dashboard**
   - Cards com métricas principais
   - Temporada atual em destaque
   - Últimos torneios
   - TOP5 jogadores atuais

2. **🏆 Temporadas**
   - Lista de temporadas
   - Criar nova temporada
   - Ver ranking da temporada
   - Status: Ativa/Finalizada

3. **🎯 Torneios**
   - Lista de torneios por temporada
   - Criar novo torneio
   - Gerenciar participações
   - Registrar pontuações

4. **👤 Jogadores** 
   - Lista de jogadores
   - Cadastrar novo jogador
   - Estatísticas individuais
   - Histórico de participações

5. **📸 Galeria**
   - Fotos organizadas por categoria
   - Upload de novas fotos
   - Hall da Fama dos campeões

6. **⚙️ Administração**
   - Gerenciar admins
   - Configurações do sistema

## 📋 FUNCIONALIDADES DETALHADAS

### 1. **DASHBOARD** 
```typescript
// Métricas principais
- Total de jogadores ativos
- Torneios da temporada atual (X/12)
- Próximo torneio agendado
- Campeão da temporada anterior

// Gráficos/Charts
- Participações por mês
- TOP5 jogadores atual
- Evolução do ranking
```

### 2. **GESTÃO DE TEMPORADAS**
```typescript
// Criar Temporada
{
  nome: "Temporada 2024",
  ano: 2024,
  data_inicio: "2024-01-01",
  data_fim: "2024-12-31",
  ativa: true
}

// Lista com:
- Nome da temporada
- Período (data_inicio - data_fim)
- Status (Ativa/Finalizada)
- Número de torneios (X/12)
- Ações: Ver Ranking, Editar, Finalizar
```

### 3. **GESTÃO DE TORNEIOS**
```typescript
// Criar Torneio
{
  id_temporada: 1,
  nome: "Torneio #1 - Janeiro",
  data_hora: "2024-01-15T20:00:00",
  local: "Clube Aces Poker",
  observacoes: "Buy-in R$ 50"
}

// Adicionar Participação
{
  id_jogador: 1,
  posicao: 1,      // 1º, 2º, 3º...
  pontuacao: 100   // Pontos ganhos
}

// Interface para registrar múltiplas participações
- Campo de busca de jogador
- Posição final (1, 2, 3...)
- Pontuação automática baseada na posição
- Botão "Adicionar Participação"
- Lista das participações atuais
- Editar/Remover participações
```

### 4. **GESTÃO DE JOGADORES**
```typescript
// Criar Jogador
{
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(11) 99999-9999",
  apelido: "João Poker",
  cidade: "São Paulo",
  data_nascimento: "1985-01-15"
}

// Estatísticas automáticas
- Total de torneios participados
- Total de pontos acumulados
- Melhor posição alcançada
- Número de vitórias
- Posição no ranking atual
```

### 5. **RANKING TOP20**
```typescript
// Exibição do ranking
interface RankingItem {
  posicao: number;
  jogador: {
    nome: string;
    apelido: string;
    avatar_url?: string;
  };
  pontuacao_total: number;
  torneios_participados: number;
  vitorias: number;
}

// Interface visual:
- Tabela com posições 1-20
- Destacar TOP3 (ouro, prata, bronze)
- Badges para campeão
- Gráfico da evolução da pontuação
```

## 🎨 DESIGN SYSTEM

### 🎨 Paleta de Cores
```css
--primary: #1a365d;      /* Azul poker escuro */
--primary-light: #2c5282; /* Azul poker médio */
--secondary: #d69e2e;     /* Dourado */
--success: #38a169;       /* Verde */
--danger: #e53e3e;        /* Vermelho */
--warning: #d69e2e;       /* Amarelo */
--background: #f7fafc;    /* Fundo claro */
--surface: #ffffff;       /* Cards/superfícies */
```

### 🖼️ Componentes Visuais
- **Cards**: Sombra sutil, bordas arredondadas
- **Tabelas**: Zebrada, hover destacado, paginação
- **Botões**: Primary, Secondary, Ghost, com ícones
- **Forms**: Labels flutuantes, validação visual
- **Modals**: Para criar/editar registros
- **Toasts**: Notificações de sucesso/erro
- **Loading**: Skeletons e spinners

### 🏆 Elementos Específicos do Poker
- **Ícones**: Cartas, fichas, troféus
- **Badges**: "Campeão", "Vice", "3º Lugar"
- **Avatares**: Placeholder para fotos dos jogadores
- **Medalhas**: Ouro, prata, bronze para TOP3

## 📱 RESPONSIVIDADE

### 📱 Mobile (< 768px)
- Menu hambúrguer
- Cards em coluna única
- Tabelas com scroll horizontal
- Formulários empilhados

### 💻 Desktop (> 768px)
- Sidebar fixa
- Layout em grid
- Tabelas completas
- Formulários em colunas

## 🔧 TECNOLOGIAS REQUERIDAS

### Frontend
- **Framework**: React ou Vue.js
- **Estado**: Context API ou Vuex
- **Roteamento**: React Router ou Vue Router
- **HTTP**: Axios
- **UI**: Components prontos (Ant Design, Chakra UI, etc.)
- **Charts**: Chart.js ou Recharts
- **Icons**: Lucide Icons ou Heroicons

### Funcionalidades
- **Autenticação JWT**: Login e proteção de rotas
- **Formulários**: Validação client-side
- **Toasts**: Feedback de ações
- **Modals**: Para criar/editar
- **Loading States**: Para chamadas API
- **Error Handling**: Tratamento de erros da API

## 🚀 MVP - FUNCIONALIDADES ESSENCIAIS

### ✅ Prioridade ALTA
1. **Login/Autenticação** com JWT
2. **Dashboard** com métricas básicas
3. **Gestão de Jogadores** (CRUD completo)
4. **Gestão de Torneios** (CRUD + participações)
5. **Ranking TOP20** da temporada atual
6. **Registrar pontuações** em torneios

### 🔄 Prioridade MÉDIA  
1. **Gestão de Temporadas** (CRUD)
2. **Estatísticas de jogadores**
3. **Histórico de participações**
4. **Galeria de fotos básica**

### 📈 Prioridade BAIXA
1. **Gráficos e charts avançados**
2. **Relatórios em PDF**
3. **Configurações avançadas**
4. **Sistema de notificações**

## 💡 EXEMPLO DE FLUXO DE USO

### 📝 Fluxo: Registrar Resultado de Torneio
1. Admin faz login
2. Navega para "Torneios"
3. Seleciona torneio da lista
4. Clica em "Gerenciar Participações"
5. Busca jogador por nome
6. Informa posição final (1º, 2º, etc.)
7. Sistema calcula pontuação automaticamente
8. Confirma participação
9. Sistema atualiza ranking automaticamente
10. Toast de sucesso confirmando ação

### 🏆 Fluxo: Ver Ranking da Temporada
1. Admin navega para "Temporadas"
2. Clica em "Ver Ranking" da temporada atual
3. Visualiza TOP20 atualizado
4. Pode exportar ou imprimir ranking

## ⚡ OBSERVAÇÕES IMPORTANTES

1. **Cálculo Automático**: O sistema backend já calcula automaticamente o ranking quando uma participação é adicionada/editada/removida
2. **Validações**: Máximo 12 torneios por temporada (validação backend)
3. **JWT Token**: Todas as requisições precisam do header `Authorization: Bearer {token}`
4. **Error Handling**: API retorna status HTTP apropriados e mensagens de erro
5. **Real-time**: Não é necessário real-time, mas dados devem ser sempre atuais

## 🎯 RESULTADO ESPERADO

Um painel administrativo completo, moderno e intuitivo que permita ao administrador do Aces Poker gerenciar facilmente:
- Cadastro de jogadores
- Criação de torneios
- Registro de pontuações
- Visualização do ranking automático
- Gestão da galeria de fotos

O sistema deve ser simples de usar, visualmente atrativo e totalmente funcional para administrar torneios de poker com a regra de negócio específica (1 temporada = 12 torneios → ranking automático TOP20).

---

**🃏 Aces Poker - Sistema de Gestão de Torneios**
*Versão MVP - Painel Administrativo*

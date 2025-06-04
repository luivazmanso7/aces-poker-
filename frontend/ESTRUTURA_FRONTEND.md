# 🏗️ ESTRUTURA FRONTEND NEXT.JS - ACES POKER ADMIN

## ✅ STATUS ATUAL DA IMPLEMENTAÇÃO

### 🎯 **IMPLEMENTADO:**
- ✅ **Dependências instaladas**: axios, react-query, lucide-react, zod, etc.
- ✅ **CSS Global**: Tema Aces Poker com variáveis CSS personalizadas
- ✅ **API Client**: Configurado com interceptors e autenticação JWT
- ✅ **Context de Auth**: Sistema completo de autenticação
- ✅ **Layout Admin**: Sidebar responsiva com navegação
- ✅ **Tipos TypeScript**: Interfaces completas do sistema
- ✅ **Utilitários**: Funções helper para formatação e styling

### 📁 **ESTRUTURA ATUALIZADA:**

```
frontend/
├── src/
│   ├── app/                          # App Router (Next.js 15)
│   │   ├── globals.css              # ✅ ATUALIZADO - Tema Aces Poker
│   │   ├── layout.tsx               # ✅ ATUALIZADO - AuthProvider
│   │   ├── page.tsx                 # ✅ Redirect para login
│   │   ├── loading.tsx              # Loading UI global
│   │   ├── error.tsx                # Error UI global
│   │   │
│   │   ├── (auth)/                  # Route Group - Autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Página de login
│   │   │   └── layout.tsx           # Layout para páginas de auth
│   │   │
│   │   └── (admin)/                 # Route Group - Admin protegido
│   │       ├── layout.tsx           # Layout com sidebar/header
│   │       ├── dashboard/
│   │       │   └── page.tsx         # Dashboard principal
│   │       ├── temporadas/
│   │       │   ├── page.tsx         # Lista de temporadas
│   │       │   ├── [id]/
│   │       │   │   ├── page.tsx     # Detalhes da temporada
│   │       │   │   └── ranking/
│   │       │   │       └── page.tsx # Ranking da temporada
│   │       │   └── nova/
│   │       │       └── page.tsx     # Criar temporada
│   │       ├── torneios/
│   │       │   ├── page.tsx         # Lista de torneios
│   │       │   ├── [id]/
│   │       │   │   ├── page.tsx     # Detalhes do torneio
│   │       │   │   └── participacoes/
│   │       │   │       └── page.tsx # Gerenciar participações
│   │       │   └── novo/
│   │       │       └── page.tsx     # Criar torneio
│   │       ├── jogadores/
│   │       │   ├── page.tsx         # Lista de jogadores
│   │       │   ├── [id]/
│   │       │   │   └── page.tsx     # Perfil do jogador
│   │       │   └── novo/
│   │       │       └── page.tsx     # Cadastrar jogador
│   │       ├── galeria/
│   │       │   ├── page.tsx         # Galeria principal
│   │       │   ├── hall-da-fama/
│   │       │   │   └── page.tsx     # Hall da fama
│   │       │   └── melhores-momentos/
│   │       │       └── page.tsx     # Melhores momentos
│   │       └── admin/
│   │           ├── page.tsx         # Gerenciar admins
│   │           └── configuracoes/
│   │               └── page.tsx     # Configurações
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── ui/                      # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── Footer.tsx
│   │   ├── forms/                   # Formulários específicos
│   │   │   ├── LoginForm.tsx
│   │   │   ├── JogadorForm.tsx
│   │   │   ├── TorneioForm.tsx
│   │   │   └── TemporadaForm.tsx
│   │   ├── tables/                  # Tabelas específicas
│   │   │   ├── JogadoresTable.tsx
│   │   │   ├── TorneiosTable.tsx
│   │   │   └── RankingTable.tsx
│   │   ├── cards/                   # Cards específicos
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── TorneioCard.tsx
│   │   │   └── RankingCard.tsx
│   │   └── common/                  # Componentes comuns
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmModal.tsx
│   │       └── PageHeader.tsx
│   │
│   ├── lib/                         # Utilitários e configurações
│   │   ├── api.ts                   # Cliente HTTP (axios)
│   │   ├── auth.ts                  # Funções de autenticação
│   │   ├── utils.ts                 # Utilitários gerais
│   │   ├── constants.ts             # Constantes da aplicação
│   │   ├── validations.ts           # Schemas de validação (zod)
│   │   └── cn.ts                    # Utility para classes CSS
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuth.ts              # Hook de autenticação
│   │   ├── useApi.ts               # Hook para chamadas API
│   │   ├── useLocalStorage.ts      # Hook para localStorage
│   │   ├── useTemporadas.ts        # Hook para temporadas
│   │   ├── useTorneios.ts          # Hook para torneios
│   │   ├── useJogadores.ts         # Hook para jogadores
│   │   └── useRanking.ts           # Hook para ranking
│   │
│   ├── contexts/                    # Context providers
│   │   ├── AuthContext.tsx         # Context de autenticação
│   │   ├── ThemeContext.tsx        # Context de tema
│   │   └── ToastContext.tsx        # Context de notificações
│   │
│   ├── types/                       # Tipos TypeScript
│   │   ├── auth.ts                 # Tipos de autenticação
│   │   ├── temporada.ts            # Tipos de temporada
│   │   ├── torneio.ts              # Tipos de torneio
│   │   ├── jogador.ts              # Tipos de jogador
│   │   ├── ranking.ts              # Tipos de ranking
│   │   ├── api.ts                  # Tipos de API
│   │   └── common.ts               # Tipos comuns
│   │
│   └── styles/                      # Estilos adicionais
│       ├── components.css          # Estilos específicos
│       └── poker-theme.css         # Tema poker personalizado
│
├── public/                          # Arquivos estáticos
│   ├── icons/                      # Ícones do poker
│   ├── images/                     # Imagens do tema
│   └── favicon.ico                 # ✅ Já existe
│
├── package.json                     # ✅ Já existe (atualizar deps)
├── tsconfig.json                    # ✅ Já existe
├── tailwind.config.ts              # Configuração do Tailwind
├── next.config.ts                   # ✅ Já existe
└── README.md                        # ✅ Já existe
```

## 🎯 PRINCIPAIS BENEFÍCIOS DESTA ESTRUTURA

### 1. **App Router (Next.js 13+)**
- ✅ Route Groups para organizar rotas
- ✅ Layouts aninhados
- ✅ Loading e Error UI automáticos
- ✅ Server Components por padrão

### 2. **Organização por Funcionalidade**
- ✅ Componentes agrupados por tipo
- ✅ Hooks específicos para cada domínio
- ✅ Types organizados por entidade
- ✅ Fácil manutenção e escalabilidade

### 3. **Autenticação Integrada**
- ✅ Route Groups para separar auth de admin
- ✅ Middleware para proteção de rotas
- ✅ Context para estado global de auth

### 4. **Design System Organizado**
- ✅ Componentes UI base (shadcn/ui)
- ✅ Componentes específicos do poker
- ✅ Tema customizado para poker
- ✅ Reutilização máxima

## 🔧 DEPENDÊNCIAS RECOMENDADAS

```json
{
  "dependencies": {
    // ✅ Já instaladas
    "react": "^19.0.0",
    "react-dom": "^19.0.0", 
    "next": "15.3.3",
    
    // 🆕 Adicionar
    "axios": "^1.6.0",                    // HTTP client
    "zod": "^3.22.0",                     // Validação
    "react-hook-form": "^7.48.0",         // Formulários
    "@hookform/resolvers": "^3.3.0",      // Resolvers para zod
    "lucide-react": "^0.294.0",           // Ícones
    "class-variance-authority": "^0.7.0", // Variantes de componentes
    "clsx": "^2.0.0",                     // Utility para classes
    "tailwind-merge": "^2.0.0",           // Merge de classes Tailwind
    "sonner": "^1.2.0",                   // Toast notifications
    "cmdk": "^0.2.0",                     // Command menu
    "recharts": "^2.8.0",                 // Gráficos
    "date-fns": "^2.30.0",                // Manipulação de datas
    "js-cookie": "^3.0.0"                 // Cookies para JWT
  },
  "devDependencies": {
    // ✅ Já instaladas
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19", 
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    
    // 🆕 Adicionar
    "@types/js-cookie": "^3.0.0",         // Types para cookies
    "@tailwindcss/forms": "^0.5.0",       // Estilos para forms
    "@tailwindcss/typography": "^0.5.0"   // Estilos para tipografia
  }
}
```

## 🎨 CONFIGURAÇÕES ESPECÍFICAS

### 1. **Tailwind Config Personalizado**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tema Aces Poker
        primary: {
          50: '#f0f9ff',
          500: '#2c5282',
          600: '#1a365d',
          900: '#0f1924',
        },
        accent: {
          50: '#fffbeb',
          500: '#d69e2e',
          600: '#b7791f',
        },
        poker: {
          gold: '#d69e2e',
          blue: '#1a365d',
          green: '#38a169',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 2. **Middleware para Autenticação**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/dashboard')

  // Redirect para login se não autenticado em páginas admin
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect para dashboard se já autenticado em páginas de auth
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

1. **Instalar dependências** essenciais
2. **Configurar shadcn/ui** para componentes base
3. **Implementar AuthContext** com JWT
4. **Criar layout base** com Header/Sidebar
5. **Implementar página de login**
6. **Desenvolver dashboard** com métricas

Esta estrutura é **escalável**, **organizada** e segue as **melhores práticas** do Next.js 13+ com App Router, sendo perfeita para o painel admin do Aces Poker! 🃏

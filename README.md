#Plataforma de gerenciamento de liga de poker 


[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black.svg)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-NestJS-red.svg)](https://nestjs.com/)
[![Database](https://img.shields.io/badge/Database-MySQL-blue.svg)](https://www.mysql.com/)

## 📋 Sobre o Projeto

é uma plataforma completa desenvolvida para gerenciar uma liga de poker profissional. O sistema oferece uma landing page pública moderna para divulgação da liga  e um painel administrativo  para gestão completa de torneios, jogadores, temporadas e galeria de fotos.

### 🎯 Objetivos Principais

- **Gestão Completa**: Administração de jogadores, torneios e temporadas
- **Sistema de Ranking**: Controle automático de pontuação e classificações
- **Landing Page Profissional**: Vitrine moderna para atrair novos membros
- **Galeria Interativa**: Documentação visual dos momentos do clube
- **Interface Intuitiva**: Design responsivo e experiência de usuário otimizada

##  Arquitetura do Sistema

### Frontend (Next.js 15)
- **Framework**: Next.js 15.3.3 com App Router
- **UI/UX**: Material-UI 7.1.1 + TailwindCSS 4
- **Animações**: Framer Motion para transições suaves
- **Estado**: TanStack React Query para cache inteligente
- **Autenticação**: JWT com cookies seguros

### Backend (NestJS)
- **Framework**: NestJS com TypeScript
- **ORM**: Prisma para acesso ao banco de dados
- **Autenticação**: JWT Strategy com Passport
- **Upload**: Sistema de upload de imagens otimizado
- **API**: RESTful com endpoints públicos e protegidos

### Banco de Dados
- **MYSQL**: Para dados relacionais
- **Prisma Schema**: Modelagem de dados robusta


## Funcionalidades Principais

###  Landing Page Pública
- **Hero Section**: Apresentação visual impactante do clube
- **Próximos Torneios**: Lista de eventos programados
- **Rankings TOP 10**: Classificação dos melhores jogadores
- **Galeria de Fotos**: Momentos marcantes organizados por categoria
- **Design Responsivo**: Otimizado para todos os dispositivos

### 🛠️ Painel Administrativo
- **Dashboard**: Visão geral com estatísticas e métricas
- **Gestão de Jogadores**: CRUD completo com histórico de performance
- **Controle de Torneios**: Criação, edição e gerenciamento de participações
- **Temporadas**: Sistema de ciclos com reset automático de rankings
- **Galeria Admin**: Upload e organização de fotos por categorias

### 📊 Sistema de Pontuação
- **Regra Base**: 1 temporada = 12 torneios completos
- **Ranking Dinâmico**: TOP 10 jogadores por temporada
- **Reset Automático**: Pontuação zerada ao final de cada temporada
- **Histórico**: Manutenção de dados para análises futuras


## 🔐 Segurança e Autenticação

### Autenticação JWT
- **Cookies Seguros**: Flags de segurança apropriadas
- **Middleware**: Proteção automática de rotas administrativas
- **Expiração**: Tokens com tempo de vida limitado
- **Logout Automático**: Em caso de tokens inválidos

### Validação de Dados
- **Schemas Zod**: Validação rigorosa de formulários
- **Sanitização**: Proteção contra ataques de injeção
- **Rate Limiting**: Controle básico de requisições

## 📱 Responsividade

### Breakpoints Material-UI
- **Mobile First**: Design otimizado para dispositivos móveis
- **Tablet**: Adaptação para telas médias
- **Desktop**: Experiência completa em telas grandes
- **Navigation**: Menu drawer para dispositivos móveis

### Componentes Adaptativos
- **Grid Layouts**: Ajuste automático de colunas
- **Tipografia**: Escalabilidade baseada no dispositivo
- **Imagens**: Otimização automática com Next.js Image

##  Performance e Otimização

### Next.js Features
- **App Router**: Roteamento moderno e otimizado
- **Image Optimization**: Compressão e lazy loading automático
- **Bundle Splitting**: Carregamento inteligente de código
- **Turbopack**: Desenvolvimento ultra-rápido

### Cache e Estado
- **React Query**: Cache inteligente de requisições API
- **Optimistic Updates**: Feedback imediato para ações do usuário
- **Lazy Loading**: Carregamento sob demanda de componentes

##  Estrutura de Dados

### Entidades Principais
- **Jogadores**: Perfis completos com estatísticas
- **Torneios**: Eventos com participações e resultados
- **Temporadas**: Ciclos de competição com rankings
- **Fotos**: Galeria organizada por categorias e eventos


## Projeto em  Desenvolvimento






---





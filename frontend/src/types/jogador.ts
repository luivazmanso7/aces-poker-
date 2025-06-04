// Interfaces para Jogadores
export interface Jogador {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  apelido?: string;
  avatar_url?: string;
  bio?: string;
  cidade?: string;
  data_nascimento?: string;
  ativo: boolean;
  criado_em: string;
  total_torneios: number;
  total_pontos: number;
  melhor_posicao?: number;
  vitorias: number;
  
  // Relações opcionais
  rankings?: Ranking[];
  participacoes?: Participacao[];
  _count?: {
    participacoes: number;
    rankings: number;
  };
}

export interface Ranking {
  id: number;
  posicao: number;
  pontuacao: number;
  atualizado_em: string;
  id_jogador: number;
  id_temporada: number;
  
  // Relações
  temporada?: {
    id: number;
    nome: string;
    ano: number;
  };
  jogador?: {
    id: number;
    nome: string;
    apelido?: string;
  };
}

export interface Participacao {
  id_torneio: number;
  id_jogador: number;
  posicao: number;
  pontuacao: number;
  criado_em: string;
  atualizado_em: string;
  
  // Relações
  torneio?: {
    id: number;
    nome: string;
    data_hora: string;
    temporada?: {
      id: number;
      nome: string;
      ano: number;
    };
  };
}

// DTOs para criação e edição
export interface CreateJogadorDto {
  nome: string;
  email?: string;
  telefone?: string;
  apelido?: string;
  avatar_url?: string;
  bio?: string;
  cidade?: string;
  data_nascimento?: string;
  ativo?: boolean;
}

export interface UpdateJogadorDto {
  nome?: string;
  email?: string;
  telefone?: string;
  apelido?: string;
  avatar_url?: string;
  bio?: string;
  cidade?: string;
  data_nascimento?: string;
  ativo?: boolean;
}

// Tipos para filtros e busca
export interface JogadorFilters {
  ativo?: boolean;
  cidade?: string;
  search?: string;
  ordenacao?: 'nome' | 'pontos' | 'vitorias' | 'torneios';
  direcao?: 'asc' | 'desc';
}

// Estatísticas do jogador
export interface JogadorStats {
  totalJogadores: number;
  jogadoresAtivos: number;
  novosCadastros30Dias: number;
  topRanking: Jogador[];
  ultimosJogadores: Jogador[];
}

// Interface para jogadores com estatísticas estendidas
export interface JogadorComEstatisticas extends Jogador {
  rankings?: Ranking[];
  participacoes?: Participacao[];
  posicaoRankingAtual?: number;
  percentualVitorias?: number;
  mediaPontosPorTorneio?: number;
  _count?: {
    participacoes: number;
    rankings: number;
  };
}

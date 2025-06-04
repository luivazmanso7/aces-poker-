// Interfaces para Torneios
export interface Torneio {
  id: number;
  id_temporada: number;
  nome: string;
  data_hora: string;
  local: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  
  // Relações
  temporada?: {
    id: number;
    nome: string;
    ano: number;
  };
  participacoes?: Participacao[];
  _count?: {
    participacoes: number;
  };
}

export interface Participacao {
  id: number;
  id_torneio: number;
  id_jogador: number;
  posicao: number;
  pontuacao: number;
  created_at: string;
  updated_at: string;
  
  // Relações
  jogador?: {
    id: number;
    nome: string;
    apelido?: string;
    foto?: string;
  };
  torneio?: {
    id: number;
    nome: string;
    data_hora: string;
  };
}

// DTOs para criar torneios
export interface CreateTorneioDto {
  id_temporada: number;
  nome: string;
  data_hora: string;
  local: string;
  observacoes?: string;
  ativo?: boolean;
}

export interface UpdateTorneioDto {
  nome?: string;
  data_hora?: string;
  local?: string;
  observacoes?: string;
  ativo?: boolean;
}

// DTOs para participações
export interface CreateParticipacaoDto {
  id_jogador: number;
  posicao: number;
  pontuacao: number;
}

export interface UpdateParticipacaoDto {
  posicao?: number;
  pontuacao?: number;
}

// Tipos para filtros e busca
export interface TorneioFilters {
  temporadaId?: number;
  ativo?: boolean;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
}

// Estatísticas do torneio
export interface TorneioStats {
  totalParticipantes: number;
  mediaParticipantes: number;
  torneioMaisParticipantes: {
    nome: string;
    participantes: number;
  };
  ultimoTorneio?: {
    nome: string;
    data_hora: string;
    participantes: number;
  };
}

export interface Temporada {
  id: number;
  nome: string;
  ano: number;
  criada_em: string;
  torneios?: Torneio[];
  rankings?: Ranking[];
}

export interface Torneio {
  id: number;
  id_temporada: number;
  nome: string;
  data_hora: string;
  local: string;
  observacoes?: string;
  ativo: boolean;
}

export interface Ranking {
  id: number;
  posicao: number;
  pontuacao: number;
  atualizado_em: string;
  id_jogador: number;
  id_temporada: number;
  jogador: {
    id: number;
    nome: string;
    apelido?: string;
    avatar_url?: string;
  };
}

export interface CreateTemporadaDto {
  nome: string;
  ano: number;
}

export interface UpdateTemporadaDto {
  nome?: string;
  ano?: number;
}

// Tipos principais do sistema Aces Poker

export interface User {
  id: number
  nome: string
  email: string
  ativo: boolean
}

export interface Jogador {
  id: number
  nome: string
  email?: string
  telefone?: string
  apelido?: string
  avatar_url?: string
  bio?: string
  cidade?: string
  data_nascimento?: string
  ativo: boolean
  total_torneios: number
  total_pontos: number
  melhor_posicao?: number
  vitorias: number
  criado_em: string
}

export interface Temporada {
  id: number
  nome: string
  ano: number
  data_inicio: string
  data_fim?: string
  ativa: boolean
  criado_em: string
  _count?: {
    torneios: number
  }
}

export interface Torneio {
  id: number
  id_temporada: number
  nome: string
  data_hora: string
  local: string
  observacoes?: string
  ativo: boolean
  temporada?: Temporada
  participacoes?: Participacao[]
  _count?: {
    participacoes: number
  }
}

export interface Participacao {
  id_torneio: number
  id_jogador: number
  posicao: number
  pontuacao: number
  jogador?: Jogador
  torneio?: Torneio
}

export interface Ranking {
  posicao: number
  id_jogador: number
  id_temporada: number
  pontuacao: number
  jogador: Jogador
  temporada?: Temporada
}

export interface Foto {
  id: number
  id_torneio?: number
  id_temporada?: number
  id_jogador?: number
  imagem_url: string
  legenda?: string
  data: string
  album: string
  categoria: 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS'
  torneio?: Torneio
  temporada?: Temporada
  jogador?: Jogador
}

export interface GaleriaOrganizada {
  temporadas: Foto[]
  hall_da_fama: Foto[]
  melhores_momentos: Foto[]
}

// DTOs para criação/edição
export interface CreateJogadorDto {
  nome: string
  email?: string
  telefone?: string
  apelido?: string
  cidade?: string
  data_nascimento?: string
}

export interface CreateTemporadaDto {
  nome: string
  ano: number
  data_inicio: string
  data_fim?: string
}

export interface CreateTorneioDto {
  id_temporada: number
  nome: string
  data_hora: string
  local: string
  observacoes?: string
}

export interface CreateParticipacaoDto {
  id_jogador: number
  posicao: number
  pontuacao: number
}

export interface CreateFotoDto {
  imagem_url: string
  legenda?: string
  album: string
  categoria: 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS'
  id_torneio?: number
  id_temporada?: number
  id_jogador?: number
}

// Tipos para estatísticas
export interface DashboardStats {
  totalJogadores: number
  torneiosTemporadaAtual: number
  maxTorneiosPorTemporada: number
  proximoTorneio?: Torneio
  campeaoAnterior?: Jogador
}

export interface JogadorComEstatisticas extends Jogador {
  rankings?: Ranking[]
  _count?: {
    participacoes: number
    rankings: number
  }
}

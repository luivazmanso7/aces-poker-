// Service para gestão de participações em torneios
import { api } from '@/lib/api';
import type { 
  Participacao, 
  CreateParticipacaoDto, 
  UpdateParticipacaoDto,
  ParticipacaoLote
} from '@/types/torneio';
import type { Jogador } from '@/types/jogador';

export const participacaoService = {
  // Obter participações de um torneio
  async getParticipacoes(torneioId: number): Promise<Participacao[]> {
    const response = await api.get(`/torneios/${torneioId}/participacoes`);
    return response.data;
  },

  // Adicionar jogador ao torneio
  async addParticipacao(torneioId: number, data: CreateParticipacaoDto): Promise<Participacao> {
    const response = await api.post(`/torneios/${torneioId}/participacoes`, data);
    return response.data;
  },

  // Atualizar participação (posição e pontos)
  async updateParticipacao(
    torneioId: number, 
    jogadorId: number, 
    data: UpdateParticipacaoDto
  ): Promise<Participacao> {
    const response = await api.patch(`/torneios/${torneioId}/participacoes/${jogadorId}`, data);
    return response.data;
  },

  // Remover jogador do torneio
  async removeParticipacao(torneioId: number, jogadorId: number): Promise<void> {
    await api.delete(`/torneios/${torneioId}/participacoes/${jogadorId}`);
  },

  // Adicionar múltiplos jogadores ao torneio
  async addMultiplosJogadores(torneioId: number, jogadores: number[]): Promise<Participacao[]> {
    const participacoes: Participacao[] = [];
    
    for (const jogadorId of jogadores) {
      const data: CreateParticipacaoDto = {
        id_jogador: jogadorId,
        posicao: 0, // Posição inicial
        pontuacao: 0 // Pontuação inicial
      };
      
      const participacao = await this.addParticipacao(torneioId, data);
      participacoes.push(participacao);
    }
    
    return participacoes;
  },

  // Atualizar resultados em lote
  async updateResultadosLote(torneioId: number, resultados: ParticipacaoLote[]): Promise<Participacao[]> {
    const participacoesAtualizadas: Participacao[] = [];
    
    for (const resultado of resultados) {
      const data: UpdateParticipacaoDto = {
        posicao: resultado.posicao,
        pontuacao: resultado.pontuacao
      };
      
      const participacao = await this.updateParticipacao(torneioId, resultado.id_jogador, data);
      participacoesAtualizadas.push(participacao);
    }
    
    return participacoesAtualizadas;
  },

  // Calcular posições automáticas baseadas na pontuação
  calcularPosicoes(participacoes: ParticipacaoLote[]): ParticipacaoLote[] {
    return participacoes
      .sort((a, b) => b.pontuacao - a.pontuacao) // Ordenar por pontuação decrescente
      .map((participacao, index) => ({
        ...participacao,
        posicao: index + 1
      }));
  },

  // Validar se todas as posições são únicas
  validarPosicoes(participacoes: ParticipacaoLote[]): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    const posicoes = participacoes.map(p => p.posicao);
    const posicoesUnicas = new Set(posicoes);
    
    if (posicoes.length !== posicoesUnicas.size) {
      erros.push('Todas as posições devem ser únicas');
    }
    
    const posicaoMinima = Math.min(...posicoes);
    const posicaoMaxima = Math.max(...posicoes);
    
    if (posicaoMinima < 1) {
      erros.push('A posição mínima deve ser 1');
    }
    
    if (posicaoMaxima > participacoes.length) {
      erros.push(`A posição máxima deve ser ${participacoes.length}`);
    }
    
    return {
      valido: erros.length === 0,
      erros
    };
  },

  // Gerar relatório de participações
  gerarRelatorio(participacoes: Participacao[]): {
    totalJogadores: number;
    pontosTotal: number;
    mediaPontos: number;
    vencedor?: Participacao;
  } {
    const totalJogadores = participacoes.length;
    const pontosTotal = participacoes.reduce((sum, p) => sum + p.pontuacao, 0);
    const mediaPontos = totalJogadores > 0 ? Math.round(pontosTotal / totalJogadores) : 0;
    const vencedor = participacoes.find(p => p.posicao === 1);
    
    return {
      totalJogadores,
      pontosTotal,
      mediaPontos,
      vencedor
    };
  },

  // Filtrar jogadores disponíveis (que não estão no torneio)
  filtrarJogadoresDisponiveis(
    todosJogadores: Jogador[], 
    participacoes: Participacao[]
  ): Jogador[] {
    const jogadoresNoTorneio = new Set(participacoes.map(p => p.id_jogador));
    return todosJogadores.filter(jogador => !jogadoresNoTorneio.has(jogador.id) && jogador.ativo);
  },

  // Formatar dados para exibição
  formatParticipacao(participacao: Participacao): {
    nomeJogador: string;
    posicaoFormatada: string;
    pontosFormatados: string;
  } {
    const nomeJogador = participacao.jogador?.apelido || participacao.jogador?.nome || 'Jogador não encontrado';
    const posicaoFormatada = participacao.posicao > 0 ? `${participacao.posicao}º lugar` : 'Não classificado';
    const pontosFormatados = participacao.pontuacao.toLocaleString() + ' pts';
    
    return {
      nomeJogador,
      posicaoFormatada,
      pontosFormatados
    };
  }
};

export default participacaoService;

import { jogadorService } from './jogador.service';
import { torneioApi } from './torneio.service';
import { temporadaApi } from './temporada.service';

export interface DashboardStatistics {
  totalJogadores: number;
  jogadoresAtivos: number;
  totalTorneios: number;
  torneiosAtivos: number;
  temporadaAtual?: {
    id: number;
    nome: string;
    ano: number;
    torneiosRealizados: number;
    totalTorneios: number;
  };
  proximoTorneio?: {
    id: number;
    nome: string;
    data_hora: string;
    local: string;
  };
  topJogadores: Array<{
    id: number;
    nome: string;
    apelido?: string;
    total_pontos: number;
    vitorias: number;
  }>;
  estatisticasRecentes: {
    novosCadastros30Dias: number;
    torneiosUltimos30Dias: number;
    participacoesUltimos30Dias: number;
  };
}

export const dashboardService = {
  // Buscar todas as estatísticas do dashboard
  async getStatistics(): Promise<DashboardStatistics> {
    try {
      // Executar todas as consultas em paralelo
      const [
        jogadores,
        torneios,
        temporadaAtual,
        topWinners
      ] = await Promise.all([
        jogadorService.findAll(),
        torneioApi.findAll(),
        temporadaApi.findCurrent(),
        jogadorService.getTopWinners(5)
      ]);

      // Calcular estatísticas de jogadores
      const totalJogadores = jogadores.length;
      const jogadoresAtivos = jogadores.filter(j => j.ativo).length;

      // Calcular estatísticas de torneios
      const totalTorneios = torneios.length;
      const torneiosAtivos = torneios.filter(t => t.ativo).length;

      // Encontrar próximo torneio (não finalizado e com data futura)
      const now = new Date();
      const proximoTorneio = torneios
        .filter(t => t.ativo && new Date(t.data_hora) > now)
        .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())[0];

      // Estatísticas da temporada atual
      let temporadaAtualInfo;
      if (temporadaAtual) {
        const torneiosTemporada = torneios.filter(t => t.id_temporada === temporadaAtual.id);
        temporadaAtualInfo = {
          id: temporadaAtual.id,
          nome: temporadaAtual.nome,
          ano: temporadaAtual.ano,
          torneiosRealizados: torneiosTemporada.length,
          totalTorneios: 12 // Máximo por temporada
        };
      }

      // Calcular estatísticas dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const novosCadastros30Dias = jogadores.filter(j => 
        new Date(j.criado_em) >= thirtyDaysAgo
      ).length;

      const torneiosUltimos30Dias = torneios.filter(t => 
        new Date(t.data_hora) >= thirtyDaysAgo
      ).length;

      // Calcular participações dos últimos 30 dias seria necessário um endpoint específico
      // Por enquanto, vamos usar uma estimativa baseada nos torneios
      const participacoesUltimos30Dias = torneiosUltimos30Dias * 8; // Estimativa de 8 participantes por torneio

      return {
        totalJogadores,
        jogadoresAtivos,
        totalTorneios,
        torneiosAtivos,
        temporadaAtual: temporadaAtualInfo,
        proximoTorneio: proximoTorneio ? {
          id: proximoTorneio.id,
          nome: proximoTorneio.nome,
          data_hora: proximoTorneio.data_hora,
          local: proximoTorneio.local
        } : undefined,
        topJogadores: topWinners.map(j => ({
          id: j.id,
          nome: j.nome,
          apelido: j.apelido,
          total_pontos: j.total_pontos || 0,
          vitorias: j.vitorias || 0
        })),
        estatisticasRecentes: {
          novosCadastros30Dias,
          torneiosUltimos30Dias,
          participacoesUltimos30Dias
        }
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  },

  // Buscar estatísticas rápidas (versão simplificada)
  async getQuickStats(): Promise<{
    totalJogadores: number;
    torneiosAtivos: number;
    temporadaAtual?: string;
  }> {
    try {
      const [jogadores, torneios, temporadaAtual] = await Promise.all([
        jogadorService.findAll(),
        torneioApi.findAll(),
        temporadaApi.findCurrent()
      ]);

      return {
        totalJogadores: jogadores.length,
        torneiosAtivos: torneios.filter(t => t.ativo).length,
        temporadaAtual: temporadaAtual ? `${temporadaAtual.nome} (${temporadaAtual.ano})` : undefined
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas rápidas:', error);
      throw error;
    }
  },

  // Formatar data para exibição
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatar números para exibição
  formatNumber(num: number): string {
    return num.toLocaleString('pt-BR');
  }
};

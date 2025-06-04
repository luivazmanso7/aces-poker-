import api from '@/lib/api';
import type { 
  Jogador, 
  CreateJogadorDto, 
  UpdateJogadorDto, 
  JogadorFilters,
  JogadorComEstatisticas,
  Participacao,
  Ranking
} from '@/types/jogador';

export const jogadorService = {
  // CRUD básico
  async findAll(): Promise<Jogador[]> {
    const response = await api.get('/jogadores');
    return response.data;
  },

  async findOne(id: number): Promise<Jogador> {
    const response = await api.get(`/jogadores/${id}`);
    return response.data;
  },

  async create(data: CreateJogadorDto): Promise<Jogador> {
    const response = await api.post('/jogadores', data);
    return response.data;
  },

  async update(id: number, data: UpdateJogadorDto): Promise<Jogador> {
    const response = await api.patch(`/jogadores/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/jogadores/${id}`);
  },

  // Métodos especializados
  async findAllWithStats(): Promise<JogadorComEstatisticas[]> {
    const response = await api.get('/jogadores/stats');
    return response.data;
  },

  async getTopWinners(limit: number = 10): Promise<Jogador[]> {
    const response = await api.get(`/jogadores/top-winners?limit=${limit}`);
    return response.data;
  },

  async getMostActive(limit: number = 10): Promise<Jogador[]> {
    const response = await api.get(`/jogadores/most-active?limit=${limit}`);
    return response.data;
  },

  async getPlayerHistory(id: number): Promise<Participacao[]> {
    const response = await api.get(`/jogadores/${id}/history`);
    return response.data;
  },

  async getPlayerRankings(id: number): Promise<Ranking[]> {
    const response = await api.get(`/jogadores/${id}/rankings`);
    return response.data;
  },

  async updateStatistics(id: number): Promise<Jogador> {
    const response = await api.post(`/jogadores/${id}/update-stats`);
    return response.data;
  },

  // Métodos auxiliares para UI
  async getJogadoresWithStats(): Promise<JogadorComEstatisticas[]> {
    const jogadores = await this.findAllWithStats();
    
    // Adicionar estatísticas calculadas
    const jogadoresComStats = jogadores.map(jogador => ({
      ...jogador,
      percentualVitorias: jogador.total_torneios > 0 
        ? Math.round((jogador.vitorias / jogador.total_torneios) * 100) 
        : 0,
      mediaPontosPorTorneio: jogador.total_torneios > 0
        ? Math.round(jogador.total_pontos / jogador.total_torneios)
        : 0
    }));

    return jogadoresComStats;
  },

  // Filtros e busca
  filterJogadores(jogadores: Jogador[], filters: JogadorFilters): Jogador[] {
    let filtered = [...jogadores];

    // Filtro por status ativo
    if (filters.ativo !== undefined) {
      filtered = filtered.filter(jogador => jogador.ativo === filters.ativo);
    }

    // Filtro por cidade
    if (filters.cidade) {
      filtered = filtered.filter(jogador => 
        jogador.cidade?.toLowerCase().includes(filters.cidade!.toLowerCase())
      );
    }

    // Busca por texto
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(jogador => 
        jogador.nome.toLowerCase().includes(search) ||
        jogador.apelido?.toLowerCase().includes(search) ||
        jogador.email?.toLowerCase().includes(search) ||
        jogador.cidade?.toLowerCase().includes(search)
      );
    }

    // Ordenação
    if (filters.ordenacao) {
      filtered.sort((a, b) => {
        let valueA: string | number, valueB: string | number;
        
        switch (filters.ordenacao) {
          case 'nome':
            valueA = a.nome.toLowerCase();
            valueB = b.nome.toLowerCase();
            break;
          case 'pontos':
            valueA = a.total_pontos;
            valueB = b.total_pontos;
            break;
          case 'vitorias':
            valueA = a.vitorias;
            valueB = b.vitorias;
            break;
          case 'torneios':
            valueA = a.total_torneios;
            valueB = b.total_torneios;
            break;
          default:
            return 0;
        }

        if (valueA < valueB) return filters.direcao === 'desc' ? 1 : -1;
        if (valueA > valueB) return filters.direcao === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  },

  // Utilitários de formatação
  formatDataNascimento(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  },

  formatDataCadastro(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  },

  calcularIdade(dataNascimento?: string): number | null {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  },

  // Validações
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateTelefone(telefone: string): boolean {
    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, '');
    // Aceita telefones com 10 ou 11 dígitos (com ou sem DDD)
    return numeros.length >= 10 && numeros.length <= 11;
  },

  formatTelefone(telefone: string): string {
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    } else if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    
    return telefone;
  },

  // Status e badges
  getStatusBadge(jogador: Jogador): { label: string; color: 'success' | 'error' | 'warning' | 'info' } {
    if (!jogador.ativo) {
      return { label: 'Inativo', color: 'error' };
    }
    
    if (jogador.vitorias > 0) {
      return { label: 'Campeão', color: 'success' };
    }
    
    if (jogador.total_torneios >= 5) {
      return { label: 'Veterano', color: 'info' };
    }
    
    return { label: 'Ativo', color: 'success' };
  },

  // Rankings e posições
  getPosicaoRanking(jogador: Jogador): string {
    if (!jogador.rankings || jogador.rankings.length === 0) {
      return 'Sem ranking';
    }
    
    const rankingAtual = jogador.rankings[0]; // Assumindo que vem ordenado pelo mais recente
    return `${rankingAtual.posicao}º lugar`;
  }
};

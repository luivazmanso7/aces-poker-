import { api } from '@/lib/api';
import { 
  Torneio, 
  CreateTorneioDto, 
  UpdateTorneioDto, 
  Participacao,
  CreateParticipacaoDto,
  UpdateParticipacaoDto,
  TorneioFilters 
} from '@/types/torneio';

export const torneioApi = {
  // CRUD básico de torneios
  async findAll(): Promise<Torneio[]> {
    const response = await api.get('/torneios');
    return response.data;
  },

  async findOne(id: number): Promise<Torneio> {
    const response = await api.get(`/torneios/${id}`);
    return response.data;
  },

  async findByTemporada(temporadaId: number): Promise<Torneio[]> {
    const response = await api.get(`/torneios/temporada/${temporadaId}`);
    return response.data;
  },

  async create(data: CreateTorneioDto): Promise<Torneio> {
    const response = await api.post('/torneios', data);
    return response.data;
  },

  async update(id: number, data: UpdateTorneioDto): Promise<Torneio> {
    const response = await api.patch(`/torneios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/torneios/${id}`);
  },

  // Gestão de participações
  async getParticipacoes(torneioId: number): Promise<Participacao[]> {
    const response = await api.get(`/torneios/${torneioId}/participacoes`);
    return response.data;
  },

  async addParticipacao(torneioId: number, data: CreateParticipacaoDto): Promise<Participacao> {
    const response = await api.post(`/torneios/${torneioId}/participacoes`, data);
    return response.data;
  },

  async updateParticipacao(
    torneioId: number, 
    jogadorId: number, 
    data: UpdateParticipacaoDto
  ): Promise<Participacao> {
    const response = await api.patch(`/torneios/${torneioId}/participacoes/${jogadorId}`, data);
    return response.data;
  },

  async removeParticipacao(torneioId: number, jogadorId: number): Promise<void> {
    await api.delete(`/torneios/${torneioId}/participacoes/${jogadorId}`);
  },

  // Métodos auxiliares para UI
  async getTorneiosWithStats(): Promise<Torneio[]> {
    const torneios = await this.findAll();
    
    // Adicionar estatísticas básicas para cada torneio
    const torneiosComStats = await Promise.all(
      torneios.map(async (torneio) => {
        try {
          const participacoes = await this.getParticipacoes(torneio.id);
          return {
            ...torneio,
            _count: {
              participacoes: participacoes.length
            }
          };
        } catch {
          return {
            ...torneio,
            _count: {
              participacoes: 0
            }
          };
        }
      })
    );

    return torneiosComStats;
  },

  // Filtros e busca
  filterTorneios(torneios: Torneio[], filters: TorneioFilters): Torneio[] {
    return torneios.filter(torneio => {
      // Filtro por temporada
      if (filters.temporadaId && torneio.id_temporada !== filters.temporadaId) {
        return false;
      }

      // Filtro por status ativo
      if (filters.ativo !== undefined && torneio.ativo !== filters.ativo) {
        return false;
      }

      // Filtro por data de início
      if (filters.dataInicio) {
        const torneioDate = new Date(torneio.data_hora);
        const startDate = new Date(filters.dataInicio);
        if (torneioDate < startDate) {
          return false;
        }
      }

      // Filtro por data de fim
      if (filters.dataFim) {
        const torneioDate = new Date(torneio.data_hora);
        const endDate = new Date(filters.dataFim);
        if (torneioDate > endDate) {
          return false;
        }
      }

      // Filtro por busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = torneio.nome.toLowerCase().includes(searchLower);
        const matchesLocal = torneio.local.toLowerCase().includes(searchLower);
        const matchesObs = torneio.observacoes?.toLowerCase().includes(searchLower) || false;
        
        if (!matchesName && !matchesLocal && !matchesObs) {
          return false;
        }
      }

      return true;
    });
  },

  // Utilitários de data
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  isUpcoming(dateString: string): boolean {
    return new Date(dateString) > new Date();
  },

  isPast(dateString: string): boolean {
    return new Date(dateString) < new Date();
  }
};

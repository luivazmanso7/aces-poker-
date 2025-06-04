import api from '@/lib/api';
import { Temporada, CreateTemporadaDto, UpdateTemporadaDto, Ranking } from '@/types/temporada';

export const temporadaApi = {
  // Buscar todas as temporadas
  findAll: async (): Promise<Temporada[]> => {
    const response = await api.get('/temporadas');
    return response.data;
  },

  // Buscar temporada por ID
  findOne: async (id: number): Promise<Temporada> => {
    const response = await api.get(`/temporadas/${id}`);
    return response.data;
  },

  // Buscar temporada atual
  findCurrent: async (): Promise<Temporada | null> => {
    const response = await api.get('/temporadas/current');
    return response.data;
  },

  // Criar nova temporada
  create: async (data: CreateTemporadaDto): Promise<Temporada> => {
    const response = await api.post('/temporadas', data);
    return response.data;
  },

  // Atualizar temporada
  update: async (id: number, data: UpdateTemporadaDto): Promise<Temporada> => {
    const response = await api.patch(`/temporadas/${id}`, data);
    return response.data;
  },

  // Deletar temporada
  delete: async (id: number): Promise<void> => {
    await api.delete(`/temporadas/${id}`);
  },

  // Buscar ranking de uma temporada
  getRanking: async (id: number): Promise<Ranking[]> => {
    const response = await api.get(`/temporadas/${id}/ranking`);
    return response.data;
  },

  // Calcular ranking de uma temporada
  calculateRanking: async (id: number): Promise<Ranking[]> => {
    const response = await api.post(`/temporadas/${id}/calculate-ranking`);
    return response.data;
  }
};

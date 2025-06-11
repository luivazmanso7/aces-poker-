import api from '@/lib/api'
import { Temporada, Torneio } from '@/types/temporada'

export interface Foto {
  id: number
  imagem_url: string
  legenda?: string
  album: string
  categoria: 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS'
  data: string
  id_torneio?: number
  id_temporada?: number
  id_jogador?: number
  torneio?: Torneio
}

export interface CreateFotoDto {
  imagem_url?: string // Agora opcional
  legenda?: string
  album: string
  categoria: 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS'
  id_torneio?: number | null
  id_temporada?: number | null
  id_jogador?: number | null
}

export interface UpdateFotoDto {
  imagem_url?: string
  legenda?: string
  album?: string
  categoria?: 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS'
  id_torneio?: number | null
  id_temporada?: number | null
  id_jogador?: number | null
}

export interface GaleriaOrganizada {
  temporadas: Foto[]
  hall_da_fama: Foto[]
  melhores_momentos: Foto[]
}

export class FotoAdminService {
  // Buscar todas as fotos organizadas por categoria
  static async getGaleriaOrganizada(): Promise<GaleriaOrganizada> {
    const response = await api.get('/admin/fotos/galeria')
    return response.data
  }

  // Buscar todas as fotos (sem organização)
  static async getAllFotos(): Promise<Foto[]> {
    const response = await api.get('/admin/fotos')
    return response.data
  }

  // Buscar temporadas disponíveis
  static async getTemporadas(): Promise<Temporada[]> {
    const response = await api.get('/temporadas')
    return response.data
  }

  // Buscar torneios disponíveis
  static async getTorneios(): Promise<Torneio[]> {
    const response = await api.get('/torneios')
    return response.data
  }

  // Criar nova foto com URL
  static async createFoto(fotoData: CreateFotoDto): Promise<Foto> {
    const response = await api.post('/admin/fotos', fotoData)
    return response.data
  }

  // Upload de arquivo de foto
  static async uploadFoto(file: File, fotoData: Omit<CreateFotoDto, 'imagem_url'>): Promise<Foto> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Adicionar outros campos do formulário
    Object.keys(fotoData).forEach(key => {
      const value = fotoData[key as keyof typeof fotoData]
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString())
      }
    })

    const response = await api.post('/admin/fotos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Atualizar foto existente
  static async updateFoto(id: number, fotoData: UpdateFotoDto): Promise<Foto> {
    const response = await api.patch(`/admin/fotos/${id}`, fotoData)
    return response.data
  }

  // Excluir foto
  static async deleteFoto(id: number): Promise<void> {
    await api.delete(`/admin/fotos/${id}`)
  }

  // Buscar fotos por categoria (público)
  static async getFotosByCategoria(categoria: string): Promise<Foto[]> {
    const response = await api.get(`/fotos/categoria/${categoria}`)
    return response.data
  }
}

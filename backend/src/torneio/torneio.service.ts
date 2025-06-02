import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemporadaService } from '../temporada/temporada.service';
import { JogadorService } from '../jogador/jogador.service';
import { CreateTorneioDto, UpdateTorneioDto } from './dto/torneio.dto';

@Injectable()
export class TorneioService {
  constructor(
    private prisma: PrismaService,
    private temporadaService: TemporadaService,
    private jogadorService: JogadorService,
  ) {}

  async create(createTorneioDto: CreateTorneioDto) {
    // Verificar se a temporada existe
    const temporada = await this.prisma.temporada.findUnique({
      where: { id: createTorneioDto.id_temporada },
    });

    if (!temporada) {
      throw new NotFoundException('Temporada não encontrada');
    }

    // Verificar quantos torneios já existem na temporada
    const torneiosCount = await this.prisma.torneio.count({
      where: { id_temporada: createTorneioDto.id_temporada },
    });

    if (torneiosCount >= 12) {
      throw new Error('Uma temporada pode ter no máximo 12 torneios');
    }

    return this.prisma.torneio.create({
      data: createTorneioDto,
      include: {
        temporada: true,
      },
    });
  }

  async findAll() {
    return this.prisma.torneio.findMany({
      include: {
        temporada: true,
        participacoes: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
        },
      },
      orderBy: { data_hora: 'desc' },
    });
  }

  async findByTemporada(temporadaId: number) {
    return this.prisma.torneio.findMany({
      where: { id_temporada: temporadaId },
      include: {
        temporada: true,
        participacoes: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
        },
      },
      orderBy: { data_hora: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.torneio.findUnique({
      where: { id },
      include: {
        temporada: true,
        participacoes: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
        },
        fotos: true,
      },
    });
  }

  async update(id: number, updateTorneioDto: UpdateTorneioDto) {
    const torneio = await this.prisma.torneio.findUnique({
      where: { id },
    });

    if (!torneio) {
      throw new NotFoundException('Torneio não encontrado');
    }

    return this.prisma.torneio.update({
      where: { id },
      data: updateTorneioDto,
      include: {
        temporada: true,
      },
    });
  }

  async remove(id: number) {
    const torneio = await this.prisma.torneio.findUnique({
      where: { id },
    });

    if (!torneio) {
      throw new NotFoundException('Torneio não encontrado');
    }

    return this.prisma.torneio.delete({
      where: { id },
    });
  }

  async getParticipacoes(torneioId: number) {
    return this.prisma.participacao.findMany({
      where: { id_torneio: torneioId },
      include: {
        jogador: true,
      },
      orderBy: { posicao: 'asc' },
    });
  }

  async addParticipacao(torneioId: number, participacaoData: {
    id_jogador: number;
    posicao: number;
    pontuacao: number;
  }) {
    const torneio = await this.prisma.torneio.findUnique({
      where: { id: torneioId },
    });

    if (!torneio) {
      throw new NotFoundException('Torneio não encontrado');
    }

    // Verificar se o jogador já está participando deste torneio
    const participacaoExistente = await this.prisma.participacao.findUnique({
      where: {
        id_torneio_id_jogador: {
          id_torneio: torneioId,
          id_jogador: participacaoData.id_jogador,
        },
      },
    });

    if (participacaoExistente) {
      throw new Error('Jogador já está participando deste torneio');
    }

    const participacao = await this.prisma.participacao.create({
      data: {
        id_torneio: torneioId,
        ...participacaoData,
      },
      include: {
        jogador: true,
        torneio: {
          include: {
            temporada: true,
          },
        },
      },
    });

    // Recalcular ranking da temporada automaticamente
    await this.temporadaService.calculateRanking(torneio.id_temporada);

    // Atualizar estatísticas do jogador
    await this.jogadorService.updateStatistics(participacaoData.id_jogador);

    return participacao;
  }

  async updateParticipacao(
    torneioId: number,
    jogadorId: number,
    updateData: {
      posicao?: number;
      pontuacao?: number;
    },
  ) {
    const participacao = await this.prisma.participacao.findUnique({
      where: {
        id_torneio_id_jogador: {
          id_torneio: torneioId,
          id_jogador: jogadorId,
        },
      },
      include: {
        torneio: true,
      },
    });

    if (!participacao) {
      throw new NotFoundException('Participação não encontrada');
    }

    const updatedParticipacao = await this.prisma.participacao.update({
      where: {
        id_torneio_id_jogador: {
          id_torneio: torneioId,
          id_jogador: jogadorId,
        },
      },
      data: updateData,
      include: {
        jogador: true,
        torneio: {
          include: {
            temporada: true,
          },
        },
      },
    });

    // Recalcular ranking da temporada automaticamente
    await this.temporadaService.calculateRanking(participacao.torneio.id_temporada);

    // Atualizar estatísticas do jogador
    await this.jogadorService.updateStatistics(jogadorId);

    return updatedParticipacao;
  }

  async removeParticipacao(torneioId: number, jogadorId: number) {
    const participacao = await this.prisma.participacao.findUnique({
      where: {
        id_torneio_id_jogador: {
          id_torneio: torneioId,
          id_jogador: jogadorId,
        },
      },
      include: {
        torneio: true,
      },
    });

    if (!participacao) {
      throw new NotFoundException('Participação não encontrada');
    }

    await this.prisma.participacao.delete({
      where: {
        id_torneio_id_jogador: {
          id_torneio: torneioId,
          id_jogador: jogadorId,
        },
      },
    });

    // Recalcular ranking da temporada automaticamente
    await this.temporadaService.calculateRanking(participacao.torneio.id_temporada);

    // Atualizar estatísticas do jogador
    await this.jogadorService.updateStatistics(jogadorId);

    return { message: 'Participação removida com sucesso' };
  }
}

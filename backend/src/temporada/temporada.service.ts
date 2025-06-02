import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemporadaDto, UpdateTemporadaDto } from './dto/temporada.dto';

@Injectable()
export class TemporadaService {
  constructor(private prisma: PrismaService) {}

  async create(createTemporadaDto: CreateTemporadaDto) {
    return this.prisma.temporada.create({
      data: createTemporadaDto,
    });
  }

  async findAll() {
    return this.prisma.temporada.findMany({
      include: {
        torneios: {
          orderBy: { data_hora: 'asc' },
        },
        rankings: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
          take: 10, // Top 10
        },
      },
      orderBy: { ano: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.temporada.findUnique({
      where: { id },
      include: {
        torneios: {
          orderBy: { data_hora: 'asc' },
        },
        rankings: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
        },
      },
    });
  }

  async findCurrentSeason() {
    const currentYear = new Date().getFullYear();
    return this.prisma.temporada.findFirst({
      where: { ano: currentYear },
      include: {
        torneios: {
          orderBy: { data_hora: 'asc' },
        },
        rankings: {
          include: {
            jogador: true,
          },
          orderBy: { posicao: 'asc' },
          take: 10, // Top 10
        },
      },
    });
  }

  async getTop10(id: number) {
    return this.prisma.ranking.findMany({
      where: { id_temporada: id },
      include: {
        jogador: true,
      },
      orderBy: { posicao: 'asc' },
      take: 10,
    });
  }

  async update(id: number, updateTemporadaDto: UpdateTemporadaDto) {
    return this.prisma.temporada.update({
      where: { id },
      data: updateTemporadaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.temporada.delete({
      where: { id },
    });
  }

  async calculateRanking(temporadaId: number) {
    // Buscar todas as participações da temporada
    const participacoes = await this.prisma.participacao.findMany({
      where: {
        torneio: {
          id_temporada: temporadaId,
        },
      },
      include: {
        jogador: true,
      },
    });

    // Agrupar por jogador e somar pontuações
    const jogadorPontuacao = participacoes.reduce((acc, participacao) => {
      const jogadorId = participacao.id_jogador;
      if (!acc[jogadorId]) {
        acc[jogadorId] = {
          jogador: participacao.jogador,
          pontuacaoTotal: 0,
        };
      }
      acc[jogadorId].pontuacaoTotal += participacao.pontuacao;
      return acc;
    }, {} as Record<number, { jogador: any; pontuacaoTotal: number }>);

    // Ordenar por pontuação e atribuir posições
    const rankingArray = Object.entries(jogadorPontuacao)
      .map(([jogadorId, data]) => ({
        id_jogador: parseInt(jogadorId),
        jogador: data.jogador,
        pontuacao: data.pontuacaoTotal,
      }))
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .map((item, index) => ({
        ...item,
        posicao: index + 1,
      }));

    // Atualizar ou criar rankings
    for (const rankingItem of rankingArray) {
      await this.prisma.ranking.upsert({
        where: {
          id_jogador_id_temporada: {
            id_jogador: rankingItem.id_jogador,
            id_temporada: temporadaId,
          },
        },
        create: {
          id_jogador: rankingItem.id_jogador,
          id_temporada: temporadaId,
          posicao: rankingItem.posicao,
          pontuacao: rankingItem.pontuacao,
        },
        update: {
          posicao: rankingItem.posicao,
          pontuacao: rankingItem.pontuacao,
          atualizado_em: new Date(),
        },
      });
    }

    return rankingArray;
  }
}

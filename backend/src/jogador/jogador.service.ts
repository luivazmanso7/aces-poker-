import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJogadorDto, UpdateJogadorDto } from './dto/jogador.dto';

@Injectable()
export class JogadorService {
  constructor(private prisma: PrismaService) {}

  async create(createJogadorDto: CreateJogadorDto) {
    return this.prisma.jogador.create({
      data: createJogadorDto,
    });
  }

  async findAll() {
    return this.prisma.jogador.findMany({
      include: {
        rankings: {
          include: {
            temporada: true,
          },
          orderBy: { temporada: { ano: 'desc' } },
        },
        participacoes: {
          include: {
            torneio: {
              include: {
                temporada: true,
              },
            },
          },
          orderBy: { criado_em: 'desc' },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.jogador.findUnique({
      where: { id },
      include: {
        rankings: {
          include: {
            temporada: true,
          },
          orderBy: { temporada: { ano: 'desc' } },
        },
        participacoes: {
          include: {
            torneio: {
              include: {
                temporada: true,
              },
            },
          },
          orderBy: { criado_em: 'desc' },
        },
      },
    });
  }

  async getPlayerHistory(id: number) {
    return this.prisma.participacao.findMany({
      where: { id_jogador: id },
      include: {
        torneio: {
          include: {
            temporada: true,
          },
        },
      },
      orderBy: { criado_em: 'desc' },
    });
  }

  async getPlayerRankings(id: number) {
    return this.prisma.ranking.findMany({
      where: { id_jogador: id },
      include: {
        temporada: true,
      },
      orderBy: { temporada: { ano: 'desc' } },
    });
  }

  async update(id: number, updateJogadorDto: UpdateJogadorDto) {
    return this.prisma.jogador.update({
      where: { id },
      data: updateJogadorDto,
    });
  }

  async remove(id: number) {
    return this.prisma.jogador.delete({
      where: { id },
    });
  }

  // Método para atualizar estatísticas do jogador
  async updateStatistics(jogadorId: number) {
    const participacoes = await this.prisma.participacao.findMany({
      where: { id_jogador: jogadorId },
    });

    const totalTorneios = participacoes.length;
    const totalPontos = participacoes.reduce((sum, p) => sum + p.pontuacao, 0);
    const melhorPosicao = participacoes.length > 0 
      ? Math.min(...participacoes.map(p => p.posicao))
      : null;
    const vitorias = participacoes.filter(p => p.posicao === 1).length;

    return this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        total_torneios: totalTorneios,
        total_pontos: totalPontos,
        melhor_posicao: melhorPosicao,
        vitorias: vitorias,
      },
    });
  }

  // Método para obter jogadores com estatísticas mais detalhadas
  async findAllWithStats() {
    return this.prisma.jogador.findMany({
      include: {
        _count: {
          select: {
            participacoes: true,
            rankings: true,
          },
        },
        rankings: {
          include: {
            temporada: true,
          },
          orderBy: { temporada: { ano: 'desc' } },
          take: 1, // Apenas o ranking mais recente
        },
      },
      orderBy: { total_pontos: 'desc' },
    });
  }

  // Método para obter top jogadores por vitórias
  async getTopWinners(limit: number = 10) {
    return this.prisma.jogador.findMany({
      where: { 
        ativo: true,
        vitorias: { gt: 0 }
      },
      orderBy: { vitorias: 'desc' },
      take: limit,
    });
  }

  // Método para obter jogadores mais ativos
  async getMostActivePlayer(limit: number = 10) {
    return this.prisma.jogador.findMany({
      where: { ativo: true },
      orderBy: { total_torneios: 'desc' },
      take: limit,
    });
  }
}

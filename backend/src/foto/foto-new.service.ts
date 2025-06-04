import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFotoDto, UpdateFotoDto, CategoriaFoto } from './dto/foto.dto';

@Injectable()
export class FotoService {
  constructor(private prisma: PrismaService) {}

  async create(createFotoDto: CreateFotoDto) {
    return this.prisma.foto.create({
      data: {
        id_torneio: createFotoDto.id_torneio || null,
        id_temporada: createFotoDto.id_temporada || null,
        id_jogador: createFotoDto.id_jogador || null,
        imagem_url: createFotoDto.imagem_url,
        legenda: createFotoDto.legenda,
        album: createFotoDto.album,
        categoria: createFotoDto.categoria,
      },
    });
  }

  async findAll() {
    return this.prisma.foto.findMany({
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findByCategoria(categoria: CategoriaFoto) {
    return this.prisma.foto.findMany({
      where: {
        categoria,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findByTemporada(id_temporada: number) {
    return this.prisma.foto.findMany({
      where: {
        OR: [
          { id_temporada },
          { 
            torneio: {
              id_temporada,
            },
          },
        ],
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findByTorneio(id_torneio: number) {
    return this.prisma.foto.findMany({
      where: {
        id_torneio,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findByJogador(id_jogador: number) {
    return this.prisma.foto.findMany({
      where: {
        id_jogador,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findHallDaFama() {
    return this.prisma.foto.findMany({
      where: {
        categoria: CategoriaFoto.HALL_DA_FAMA,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findMelhoresMomentos() {
    return this.prisma.foto.findMany({
      where: {
        categoria: CategoriaFoto.MELHORES_MOMENTOS,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findGaleriaOrganizada() {
    const [temporadas, hallDaFama, melhoresMomentos] = await Promise.all([
      this.findByCategoria(CategoriaFoto.TEMPORADA),
      this.findHallDaFama(),
      this.findMelhoresMomentos(),
    ]);

    return {
      temporadas,
      hall_da_fama: hallDaFama,
      melhores_momentos: melhoresMomentos,
    };
  }

  async findOne(id: number) {
    return this.prisma.foto.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateFotoDto: UpdateFotoDto) {
    return this.prisma.foto.update({
      where: { id },
      data: updateFotoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.foto.delete({
      where: { id },
    });
  }

  async removeByTorneio(id_torneio: number) {
    return this.prisma.foto.deleteMany({
      where: {
        id_torneio,
      },
    });
  }

  async removeByCategoria(categoria: CategoriaFoto) {
    return this.prisma.foto.deleteMany({
      where: {
        categoria,
      },
    });
  }
}

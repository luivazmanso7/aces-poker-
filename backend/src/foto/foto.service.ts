import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFotoDto, UpdateFotoDto, CategoriaFoto } from './dto/foto.dto';

@Injectable()
export class FotoService {
  constructor(private prisma: PrismaService) {}

  async create(createFotoDto: CreateFotoDto) {
    const data: any = {
      imagem_url: createFotoDto.imagem_url,
      album: createFotoDto.album,
      categoria: createFotoDto.categoria,
    };

    if (createFotoDto.legenda) data.legenda = createFotoDto.legenda;
    if (createFotoDto.id_torneio) data.id_torneio = createFotoDto.id_torneio;
    if (createFotoDto.id_temporada) data.id_temporada = createFotoDto.id_temporada;
    if (createFotoDto.id_jogador) data.id_jogador = createFotoDto.id_jogador;

    return this.prisma.foto.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.foto.findMany({
      include: {
        torneio: true,
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
      include: {
        torneio: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findHallDaFama() {
    return this.prisma.foto.findMany({
      where: {
        categoria: 'HALL_DA_FAMA',
      },
      include: {
        torneio: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findMelhoresMomentos() {
    return this.prisma.foto.findMany({
      where: {
        categoria: 'MELHORES_MOMENTOS',
      },
      include: {
        torneio: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findTemporadas() {
    return this.prisma.foto.findMany({
      where: {
        categoria: 'TEMPORADA',
      },
      include: {
        torneio: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findGaleriaOrganizada() {
    const [temporadas, hallDaFama, melhoresMomentos] = await Promise.all([
      this.findTemporadas(),
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
      include: {
        torneio: true,
      },
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
}

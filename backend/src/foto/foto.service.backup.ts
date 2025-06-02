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
        jogador: true,
      },
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
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
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
        temporada: true,
        jogador: true,
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
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
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
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
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
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
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
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findTemporadas() {
    return this.prisma.foto.findMany({
      where: {
        categoria: CategoriaFoto.TEMPORADA,
      },
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
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
        temporada: true,
        jogador: true,
      },
    });
  }

  async update(id: number, updateFotoDto: UpdateFotoDto) {
    const updateData: any = {};
    
    if (updateFotoDto.id_torneio !== undefined) updateData.id_torneio = updateFotoDto.id_torneio;
    if (updateFotoDto.id_temporada !== undefined) updateData.id_temporada = updateFotoDto.id_temporada;
    if (updateFotoDto.id_jogador !== undefined) updateData.id_jogador = updateFotoDto.id_jogador;
    if (updateFotoDto.imagem_url) updateData.imagem_url = updateFotoDto.imagem_url;
    if (updateFotoDto.legenda !== undefined) updateData.legenda = updateFotoDto.legenda;
    if (updateFotoDto.album) updateData.album = updateFotoDto.album;
    if (updateFotoDto.categoria) updateData.categoria = updateFotoDto.categoria;

    return this.prisma.foto.update({
      where: { id },
      data: updateData,
      include: {
        torneio: true,
        temporada: true,
        jogador: true,
      },
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

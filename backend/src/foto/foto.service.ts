import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFotoDto, UpdateFotoDto } from './dto/foto.dto';

@Injectable()
export class FotoService {
  constructor(private prisma: PrismaService) {}

  async create(createFotoDto: CreateFotoDto) {
    return this.prisma.foto.create({
      data: createFotoDto,
    });
  }

  async findAll() {
    return this.prisma.foto.findMany({
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

  async findByTemporada(id_temporada: number) {
    return this.prisma.foto.findMany({
      where: {
        torneio: {
          id_temporada,
        },
      },
      orderBy: {
        data: 'desc',
      },
    });
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
}

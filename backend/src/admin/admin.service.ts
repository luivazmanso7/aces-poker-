import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const { nome, email, senha } = createAdminDto;

    // Verificar se email já existe
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      throw new ConflictException('Email já está em uso');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    return this.prisma.admin.create({
      data: {
        nome,
        email,
        senha: hashedPassword
      },
      select: {
        id: true,
        nome: true,
        email: true,
        created_at: true
      }
    });
  }

  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        created_at: true
      }
    });
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        created_at: true
      }
    });

    if (!admin) {
      throw new NotFoundException('Admin não encontrado');
    }

    return admin;
  }

  async findByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email }
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    const updateData: any = {};

    if (updateAdminDto.nome) {
      updateData.nome = updateAdminDto.nome;
    }

    if (updateAdminDto.email) {
      // Verificar se email já existe
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { email: updateAdminDto.email }
      });

      if (existingAdmin && existingAdmin.id !== id) {
        throw new ConflictException('Email já está em uso');
      }

      updateData.email = updateAdminDto.email;
    }

    if (updateAdminDto.senha) {
      updateData.senha = await bcrypt.hash(updateAdminDto.senha, 10);
    }

    return this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        created_at: true
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.admin.delete({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
  }
}
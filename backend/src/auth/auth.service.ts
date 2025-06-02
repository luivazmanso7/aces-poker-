import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { email }
    });

    if (admin && await bcrypt.compare(password, admin.senha)) {
      const { senha, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const admin = await this.validateUser(email, password);
    if (!admin) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
      email: admin.email, 
      sub: admin.id, 
      nome: admin.nome 
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email
      }
    };
  }

  async profile(userId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        created_at: true
      }
    });

    if (!admin) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return admin;
  }
}
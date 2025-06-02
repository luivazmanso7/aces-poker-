import { Module } from '@nestjs/common';
import { JogadorController } from './jogador.controller';
import { JogadorService } from './jogador.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JogadorController],
  providers: [JogadorService],
  exports: [JogadorService],
})
export class JogadorModule {}

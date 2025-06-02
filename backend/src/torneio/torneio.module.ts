import { Module } from '@nestjs/common';
import { TorneioController } from './torneio.controller';
import { TorneioService } from './torneio.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TemporadaModule } from '../temporada/temporada.module';
import { JogadorModule } from '../jogador/jogador.module';

@Module({
  imports: [PrismaModule, TemporadaModule, JogadorModule],
  controllers: [TorneioController],
  providers: [TorneioService],
  exports: [TorneioService],
})
export class TorneioModule {}

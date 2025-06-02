import { Module } from '@nestjs/common';
import { TemporadaController } from './temporada.controller';
import { TemporadaService } from './temporada.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TemporadaController],
  providers: [TemporadaService],
  exports: [TemporadaService],
})
export class TemporadaModule {}

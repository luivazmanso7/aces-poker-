import { Module } from '@nestjs/common';
import { FotoController } from './foto.controller';
import { FotoPublicController } from './foto-public.controller';
import { FotoService } from './foto.service';

@Module({
  controllers: [FotoController, FotoPublicController],
  providers: [FotoService],
  exports: [FotoService],
})
export class FotoModule {}

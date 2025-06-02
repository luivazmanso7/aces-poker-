import { Module } from '@nestjs/common';
import { FotoController } from './foto.controller';
import { FotoService } from './foto.service';

@Module({
  controllers: [FotoController],
  providers: [FotoService],
  exports: [FotoService],
})
export class FotoModule {}

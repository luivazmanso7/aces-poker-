import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FotoModule } from '../foto/foto.module';

@Module({
  imports: [PrismaModule, FotoModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { TemporadaModule } from './temporada/temporada.module';
import { JogadorModule } from './jogador/jogador.module';
import { TorneioModule } from './torneio/torneio.module';
import { FotoModule } from './foto/foto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    AdminModule, 
    AuthModule,
    TemporadaModule,
    JogadorModule,
    TorneioModule,
    FotoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

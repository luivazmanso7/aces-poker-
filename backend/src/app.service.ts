import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Aces Poker API - Sistema de Login JWT funcionando!';
  }
}

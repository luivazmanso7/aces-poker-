import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FotoService } from './foto.service';

// Controller PÚBLICO para fotos (sem autenticação)
@Controller('public/fotos')
export class FotoPublicController {
  constructor(private readonly fotoService: FotoService) {}

  // Galeria completa organizada - PÚBLICO
  @Get('galeria')
  findGaleriaOrganizada() {
    return this.fotoService.findGaleriaOrganizada();
  }

  // Fotos por categoria - PÚBLICO
  @Get('categoria/:categoria')
  findByCategoria(@Param('categoria') categoria: string) {
    switch(categoria) {
      case 'HALL_DA_FAMA':
        return this.fotoService.findHallDaFama();
      case 'MELHORES_MOMENTOS':
        return this.fotoService.findMelhoresMomentos();
      case 'TEMPORADA':
        return this.fotoService.findTemporadas();
      default:
        return this.fotoService.findTemporadas();
    }
  }

  // Fotos por temporada específica - PÚBLICO
  @Get('temporada/:id')
  findByTemporada(@Param('id', ParseIntPipe) id: number) {
    return this.fotoService.findByTemporada(id);
  }

  // Fotos por torneio específico - PÚBLICO
  @Get('torneio/:id')
  findByTorneio(@Param('id', ParseIntPipe) id: number) {
    return this.fotoService.findByTorneio(id);
  }

  // Hall da fama - PÚBLICO
  @Get('hall-da-fama')
  findHallDaFama() {
    return this.fotoService.findHallDaFama();
  }

  // Melhores momentos - PÚBLICO
  @Get('melhores-momentos')
  findMelhoresMomentos() {
    return this.fotoService.findMelhoresMomentos();
  }

  // Fotos da temporada - PÚBLICO
  @Get('temporadas')
  findTemporadas() {
    return this.fotoService.findTemporadas();
  }
}

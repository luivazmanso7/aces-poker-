import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FotoService } from './foto.service';
import { CreateFotoDto, UpdateFotoDto, CategoriaFoto } from './dto/foto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fotos')
@UseGuards(JwtAuthGuard)
export class FotoController {
  constructor(private readonly fotoService: FotoService) {}

  @Post()
  create(@Body() createFotoDto: CreateFotoDto) {
    return this.fotoService.create(createFotoDto);
  }

  @Get()
  findAll() {
    return this.fotoService.findAll();
  }

  @Get('galeria')
  findGaleriaOrganizada() {
    return this.fotoService.findGaleriaOrganizada();
  }

  @Get('hall-da-fama')
  findHallDaFama() {
    return this.fotoService.findHallDaFama();
  }

  @Get('melhores-momentos')
  findMelhoresMomentos() {
    return this.fotoService.findMelhoresMomentos();
  }

  @Get('temporadas')
  findTemporadas() {
    return this.fotoService.findTemporadas();
  }

  @Get('categoria/:categoria')
  findByCategoria(@Param('categoria') categoria: string) {
    // Mapear categoria para os métodos específicos
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

  @Get('jogador/:id_jogador')
  async findByJogador(@Param('id_jogador', ParseIntPipe) id_jogador: number) {
    // Por enquanto, retornar array vazio até implementarmos a funcionalidade
    return [];
  }

  @Get('torneio/:id_torneio')
  findByTorneio(@Param('id_torneio', ParseIntPipe) id_torneio: number) {
    return this.fotoService.findByTorneio(id_torneio);
  }

  @Get('temporada/:id_temporada')
  findByTemporada(@Param('id_temporada', ParseIntPipe) id_temporada: number) {
    // Por enquanto, retornar temporadas gerais até implementarmos filtro específico
    return this.fotoService.findTemporadas();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fotoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFotoDto: UpdateFotoDto,
  ) {
    return this.fotoService.update(id, updateFotoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fotoService.remove(id);
  }

  @Delete('torneio/:id_torneio')
  removeByTorneio(@Param('id_torneio', ParseIntPipe) id_torneio: number) {
    return this.fotoService.removeByTorneio(id_torneio);
  }
}

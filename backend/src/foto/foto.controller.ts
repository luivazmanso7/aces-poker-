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
} from '@nestjs/common';
import { FotoService } from './foto.service';
import { CreateFotoDto, UpdateFotoDto } from './dto/foto.dto';
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

  @Get('torneio/:id_torneio')
  findByTorneio(@Param('id_torneio', ParseIntPipe) id_torneio: number) {
    return this.fotoService.findByTorneio(id_torneio);
  }

  @Get('temporada/:id_temporada')
  findByTemporada(@Param('id_temporada', ParseIntPipe) id_temporada: number) {
    return this.fotoService.findByTemporada(id_temporada);
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

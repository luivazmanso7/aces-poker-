import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TemporadaService } from './temporada.service';
import { CreateTemporadaDto, UpdateTemporadaDto } from './dto/temporada.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('temporadas')
@UseGuards(JwtAuthGuard)
export class TemporadaController {
  constructor(private readonly temporadaService: TemporadaService) {}

  @Post()
  create(@Body() createTemporadaDto: CreateTemporadaDto) {
    return this.temporadaService.create(createTemporadaDto);
  }

  @Get()
  findAll() {
    return this.temporadaService.findAll();
  }

  @Get('current')
  findCurrentSeason() {
    return this.temporadaService.findCurrentSeason();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temporadaService.findOne(+id);
  }

  @Get(':id/ranking')
  getTop10(@Param('id') id: string) {
    return this.temporadaService.getTop10(+id);
  }

  @Post(':id/calculate-ranking')
  calculateRanking(@Param('id') id: string) {
    return this.temporadaService.calculateRanking(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemporadaDto: UpdateTemporadaDto,
  ) {
    return this.temporadaService.update(+id, updateTemporadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temporadaService.remove(+id);
  }
}

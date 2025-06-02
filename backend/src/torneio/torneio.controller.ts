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
import { TorneioService } from './torneio.service';
import {
  CreateTorneioDto,
  UpdateTorneioDto,
  CreateParticipacaoDto,
  UpdateParticipacaoDto,
} from './dto/torneio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('torneios')
@UseGuards(JwtAuthGuard)
export class TorneioController {
  constructor(private readonly torneioService: TorneioService) {}

  @Post()
  create(@Body() createTorneioDto: CreateTorneioDto) {
    return this.torneioService.create(createTorneioDto);
  }

  @Get()
  findAll() {
    return this.torneioService.findAll();
  }

  @Get('temporada/:temporadaId')
  findByTemporada(@Param('temporadaId') temporadaId: string) {
    return this.torneioService.findByTemporada(+temporadaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.torneioService.findOne(+id);
  }

  @Get(':id/participacoes')
  getParticipacoes(@Param('id') id: string) {
    return this.torneioService.getParticipacoes(+id);
  }

  @Post(':id/participacoes')
  addParticipacao(
    @Param('id') id: string,
    @Body() createParticipacaoDto: CreateParticipacaoDto,
  ) {
    return this.torneioService.addParticipacao(+id, createParticipacaoDto);
  }

  @Patch(':torneioId/participacoes/:jogadorId')
  updateParticipacao(
    @Param('torneioId') torneioId: string,
    @Param('jogadorId') jogadorId: string,
    @Body() updateParticipacaoDto: UpdateParticipacaoDto,
  ) {
    return this.torneioService.updateParticipacao(
      +torneioId,
      +jogadorId,
      updateParticipacaoDto,
    );
  }

  @Delete(':torneioId/participacoes/:jogadorId')
  removeParticipacao(
    @Param('torneioId') torneioId: string,
    @Param('jogadorId') jogadorId: string,
  ) {
    return this.torneioService.removeParticipacao(+torneioId, +jogadorId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTorneioDto: UpdateTorneioDto,
  ) {
    return this.torneioService.update(+id, updateTorneioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.torneioService.remove(+id);
  }
}

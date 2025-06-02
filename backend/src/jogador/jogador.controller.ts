import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { CreateJogadorDto, UpdateJogadorDto } from './dto/jogador.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jogadores')
@UseGuards(JwtAuthGuard)
export class JogadorController {
  constructor(private readonly jogadorService: JogadorService) {}

  @Post()
  create(@Body() createJogadorDto: CreateJogadorDto) {
    return this.jogadorService.create(createJogadorDto);
  }

  @Get()
  findAll() {
    return this.jogadorService.findAll();
  }

  @Get('stats')
  findAllWithStats() {
    return this.jogadorService.findAllWithStats();
  }

  @Get('top-winners')
  getTopWinners(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.jogadorService.getTopWinners(limitNum);
  }

  @Get('most-active')
  getMostActivePlayer(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.jogadorService.getMostActivePlayer(limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jogadorService.findOne(+id);
  }

  @Get(':id/history')
  getPlayerHistory(@Param('id') id: string) {
    return this.jogadorService.getPlayerHistory(+id);
  }

  @Get(':id/rankings')
  getPlayerRankings(@Param('id') id: string) {
    return this.jogadorService.getPlayerRankings(+id);
  }

  @Post(':id/update-stats')
  updateStatistics(@Param('id') id: string) {
    return this.jogadorService.updateStatistics(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJogadorDto: UpdateJogadorDto,
  ) {
    return this.jogadorService.update(+id, updateJogadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jogadorService.remove(+id);
  }
}

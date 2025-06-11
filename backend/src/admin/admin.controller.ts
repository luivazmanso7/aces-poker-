import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FotoService } from '../foto/foto.service';
import { CreateFotoDto, UpdateFotoDto } from '../foto/dto/foto.dto';
import { UploadService } from '../common/services/upload.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fotoService: FotoService
  ) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }

  @Get('fotos')
  getAllFotos() {
    return this.fotoService.findAll();
  }

  @Get('fotos/galeria')
  getGaleriaOrganizada() {
    return this.fotoService.findGaleriaOrganizada();
  }

  @Post('fotos')
  createFoto(@Body() createFotoDto: CreateFotoDto) {
    return this.fotoService.create(createFotoDto);
  }

  @Post('fotos/upload')
  @UseInterceptors(FileInterceptor('file', UploadService.getMulterOptions()))
  async uploadFoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFotoDto: CreateFotoDto
  ) {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }

    // Gerar URL da imagem
    const imageUrl = UploadService.getFileUrl(file.filename);

    // Criar foto com URL gerada
    const fotoData = {
      ...createFotoDto,
      imagem_url: imageUrl,
      id_torneio: createFotoDto.id_torneio ? Number(createFotoDto.id_torneio) : null,
      id_temporada: createFotoDto.id_temporada ? Number(createFotoDto.id_temporada) : null,
      id_jogador: createFotoDto.id_jogador ? Number(createFotoDto.id_jogador) : null,
    };

    return this.fotoService.create(fotoData);
  }

  @Patch('fotos/:id')
  updateFoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFotoDto: UpdateFotoDto
  ) {
    return this.fotoService.update(id, updateFotoDto);
  }

  @Delete('fotos/:id')
  removeFoto(@Param('id', ParseIntPipe) id: number) {
    return this.fotoService.remove(id);
  }
}
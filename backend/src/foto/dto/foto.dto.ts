import { IsString, IsOptional, IsUrl, IsInt, IsEnum } from 'class-validator';

export enum CategoriaFoto {
  TEMPORADA = 'TEMPORADA',
  HALL_DA_FAMA = 'HALL_DA_FAMA',
  MELHORES_MOMENTOS = 'MELHORES_MOMENTOS',
}

export class CreateFotoDto {
  @IsOptional()
  @IsInt()
  id_torneio?: number;

  @IsOptional()
  @IsInt()
  id_temporada?: number;

  @IsOptional()
  @IsInt()
  id_jogador?: number;

  @IsOptional()
  @IsString()
  imagem_url?: string; // Tornado opcional para suportar uploads

  @IsOptional()
  @IsString()
  legenda?: string;

  @IsString()
  album: string;

  @IsEnum(CategoriaFoto)
  categoria: CategoriaFoto;
}

export class UpdateFotoDto {
  @IsOptional()
  @IsInt()
  id_torneio?: number;

  @IsOptional()
  @IsInt()
  id_temporada?: number;

  @IsOptional()
  @IsInt()
  id_jogador?: number;

  @IsOptional()
  @IsUrl()
  imagem_url?: string;

  @IsOptional()
  @IsString()
  legenda?: string;

  @IsOptional()
  @IsString()
  album?: string;

  @IsOptional()
  @IsEnum(CategoriaFoto)
  categoria?: CategoriaFoto;
}

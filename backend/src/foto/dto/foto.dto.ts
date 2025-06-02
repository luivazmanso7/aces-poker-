import { IsString, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreateFotoDto {
  @IsInt()
  id_torneio: number;

  @IsUrl()
  imagem_url: string;

  @IsOptional()
  @IsString()
  legenda?: string;

  @IsString()
  album: string;
}

export class UpdateFotoDto {
  @IsOptional()
  @IsInt()
  id_torneio?: number;

  @IsOptional()
  @IsUrl()
  imagem_url?: string;

  @IsOptional()
  @IsString()
  legenda?: string;

  @IsOptional()
  @IsString()
  album?: string;
}

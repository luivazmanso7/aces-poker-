import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTemporadaDto {
  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @IsInt({ message: 'Ano deve ser um número inteiro' })
  @Min(2020, { message: 'Ano deve ser maior que 2020' })
  ano: number;
}

export class UpdateTemporadaDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  nome?: string;

  @IsOptional()
  @IsInt({ message: 'Ano deve ser um número inteiro' })
  @Min(2020, { message: 'Ano deve ser maior que 2020' })
  ano?: number;
}

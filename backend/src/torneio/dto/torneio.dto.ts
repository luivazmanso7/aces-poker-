import { IsString, IsInt, IsDateString, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTorneioDto {
  @IsInt({ message: 'ID da temporada deve ser um número inteiro' })
  id_temporada: number;

  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @IsDateString({}, { message: 'Data e hora devem estar em formato válido' })
  data_hora: string;

  @IsString({ message: 'Local deve ser uma string' })
  local: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  ativo?: boolean;
}

export class UpdateTorneioDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  nome?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data e hora devem estar em formato válido' })
  data_hora?: string;

  @IsOptional()
  @IsString({ message: 'Local deve ser uma string' })
  local?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  ativo?: boolean;
}

export class CreateParticipacaoDto {
  @IsInt({ message: 'ID do jogador deve ser um número inteiro' })
  id_jogador: number;

  @IsInt({ message: 'Posição deve ser um número inteiro' })
  @Min(1, { message: 'Posição deve ser maior que 0' })
  posicao: number;

  @IsInt({ message: 'Pontuação deve ser um número inteiro' })
  @Min(0, { message: 'Pontuação deve ser maior ou igual a 0' })
  pontuacao: number;
}

export class UpdateParticipacaoDto {
  @IsOptional()
  @IsInt({ message: 'Posição deve ser um número inteiro' })
  @Min(1, { message: 'Posição deve ser maior que 0' })
  posicao?: number;

  @IsOptional()
  @IsInt({ message: 'Pontuação deve ser um número inteiro' })
  @Min(0, { message: 'Pontuação deve ser maior ou igual a 0' })
  pontuacao?: number;
}

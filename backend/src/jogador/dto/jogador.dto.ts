import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  IsBoolean, 
  IsDateString,
  IsUrl,
  Length,
  IsPhoneNumber
} from 'class-validator';

export class CreateJogadorDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  nome: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Length(10, 20, { message: 'Telefone deve ter entre 10 e 20 caracteres' })
  telefone?: string;

  @IsOptional()
  @IsString({ message: 'Apelido deve ser uma string' })
  @Length(2, 50, { message: 'Apelido deve ter entre 2 e 50 caracteres' })
  apelido?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL deve ser uma URL válida' })
  avatar_url?: string;

  @IsOptional()
  @IsString({ message: 'Bio deve ser uma string' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  @Length(2, 100, { message: 'Cidade deve ter entre 2 e 100 caracteres' })
  cidade?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve ter formato válido (YYYY-MM-DD)' })
  data_nascimento?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  ativo?: boolean;
}

export class UpdateJogadorDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Length(10, 20, { message: 'Telefone deve ter entre 10 e 20 caracteres' })
  telefone?: string;

  @IsOptional()
  @IsString({ message: 'Apelido deve ser uma string' })
  @Length(2, 50, { message: 'Apelido deve ter entre 2 e 50 caracteres' })
  apelido?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL deve ser uma URL válida' })
  avatar_url?: string;

  @IsOptional()
  @IsString({ message: 'Bio deve ser uma string' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  @Length(2, 100, { message: 'Cidade deve ter entre 2 e 100 caracteres' })
  cidade?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve ter formato válido (YYYY-MM-DD)' })
  data_nascimento?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  ativo?: boolean;
}

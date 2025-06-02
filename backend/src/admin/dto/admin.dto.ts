import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}

export class UpdateAdminDto {
  @IsString()
  nome?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  senha?: string;
}
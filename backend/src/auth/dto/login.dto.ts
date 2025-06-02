import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString({ message: 'Password deve ser uma string' })
  @MinLength(6, { message: 'Password deve ter pelo menos 6 caracteres' })
  password: string;
}
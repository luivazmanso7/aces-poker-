import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Tratamento específico para erros do Prisma
      status = HttpStatus.BAD_REQUEST;
      
      switch (exception.code) {
        case 'P2002':
          message = `Já existe um registro com essas informações. Campo duplicado: ${exception.meta?.target}`;
          break;
        case 'P2025':
          message = 'Registro não encontrado';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Operação violou restrição de chave estrangeira';
          break;
        case 'P2014':
          message = 'A operação falhou devido a dependências entre registros';
          break;
        default:
          message = 'Erro na operação do banco de dados';
      }
    }

    // Log do erro para debugging
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
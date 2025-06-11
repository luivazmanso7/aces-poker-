import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  static getMulterOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'fotos');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtension = extname(file.originalname);
          cb(null, `foto-${uniqueSuffix}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  static getFileUrl(filename: string): string {
    return `/uploads/fotos/${filename}`;
  }
}

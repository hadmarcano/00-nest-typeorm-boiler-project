import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:fileId')
  getProductImage(@Res() res: Response, @Param('fileId') fileId: string) {
    const path = this.filesService.getStaticFile(fileId);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fieldSize: 1024 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    if (!file) {
      throw new BadRequestException('Not file found!');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl,
    };
  }
}

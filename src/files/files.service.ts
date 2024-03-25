import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticFile(fileId: string) {
    const path = join(__dirname, '../../static/products', fileId);

    // console.log(path);

    if (!existsSync(path)) {
      throw new BadRequestException('File not found!');
    }
    return path;
  }
}

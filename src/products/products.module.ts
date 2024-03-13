import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature(entities)],
})
export class ProductsModule {}

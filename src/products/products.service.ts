import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  //
  private readonly logger = new Logger('ProductsService');
  //
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...rest } = createProductDto;

      const product = this.productRepository.create({
        ...rest,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbExecption(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // RELATIONSHIPS
      relations: ['images'],
    });
    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);

    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbExecption(error);
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    await this.productRepository.remove(product);
  }

  private handleDbExecption(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Error creating product');
  }
}

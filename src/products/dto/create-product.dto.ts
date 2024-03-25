import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Nike Air Max 90',
    description: 'This is the title of the product',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 100.0,
    description: 'This is the price of the product',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'This is the description of the product',
    description: 'This is the description of the product',
    default: null,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'nike-air-max-90',
    description: 'This is the slug of the product',
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 100,
    description: 'This is the stock of the product',
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M'],
    description: 'This is the color of the product',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'This is the gender of the product',
  })
  @IsString()
  @IsIn(['men', 'women', 'unisex', 'kids'])
  gender: string;

  @ApiProperty({
    example: ['nike', 'shoes'],
    description: 'This is the tags of the product',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiProperty({
    example: ['image1', 'image2'],
    description: 'This is the images of the product',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

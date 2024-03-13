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
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString()
  @IsIn(['men', 'women', 'unisex', 'kids'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

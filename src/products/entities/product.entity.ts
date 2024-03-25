import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '61642281-c25b-4f11-a78d-2cd6adcccfa3',
    description: 'This is the unique id of the product',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nike Air Max 90',
    description: 'This is the title of the product',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 100.0,
    description: 'This is the price of the product',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'This is the description of the product',
    description: 'This is the description of the product',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'nike-air-max-90',
    description: 'This is the slug of the product',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'This is the stock of the product',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M'],
    description: 'This is the color of the product',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'This is the gender of the product',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['nike', 'shoes'],
    description: 'This is the tags of the product',
    default: [],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[]; //tags

  @ApiProperty({
    example: ['https://example.com/image.jpg'],
    description: 'This is the main image of the product',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  /* The `@ManyToOne(() => User, (user) => user.product, { eager: true })` decorator in the `Product`
  entity class is defining a many-to-one relationship between the `Product` entity and the `User`
  entity. */
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }
}

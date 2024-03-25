import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const adminUser = await this.InsertUsers();

    await this.insertNewProducts(adminUser);

    return 'Seed executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async InsertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      const newUser = this.userRepository.create(user);
      users.push(newUser);
    });

    await this.userRepository.save(users);

    return users[0]; // Return the first (and only) user created
  }

  private async insertNewProducts(user: User) {
    /* The code snippet is part of the `insertNewProducts` method in the `SeedService` class. Here's
   what it does: */
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';
// import { ValidRoles } from 'src/auth/interfaces';
// import { Auth } from 'src/auth/decorators';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}

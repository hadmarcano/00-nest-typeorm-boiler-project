import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
// import { User } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('protected')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    // @GetUser() user: User,
    @GetUser('id') userId: string,
    // @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request);

    return {
      ok: true,
      message: 'Resource Protected',
      id: userId,
      headers,
    };
  }

  @Get('protected2')
  /* The `@SetMetadata('roles', ['admin', 'super-user'])` decorator is setting metadata on the route
 handler function. In this case, it is setting the roles metadata with values 'admin' and
 'super-user'. This metadata can be accessed later within the application for various purposes. */
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(
    @GetUser('id') userId: string,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Resource 2 Protected',
      id: userId,
      headers,
    };
  }

  @Get('protected3')
  /* The `@RoleProtected(ValidRoles.superUser, ValidRoles.user)` decorator is setting the roles that
  are allowed to access the route. In this case, it is allowing users with roles of 'superUser' or
  'user' to access the route. */
  @RoleProtected(ValidRoles.superUser, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute3(@GetUser('id') userId: string) {
    return {
      ok: true,
      message: 'Resource 3 Protected',
      id: userId,
    };
  }

  @Get('protected4')
  @Auth(ValidRoles.superUser, ValidRoles.user)
  testingPrivateRoute4(@GetUser('id') userId: string) {
    return {
      ok: true,
      message: 'Resource 4 Protected',
      id: userId,
    };
  }
}

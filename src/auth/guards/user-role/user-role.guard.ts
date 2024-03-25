import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

/* The UserRoleGuard class in TypeScript is used to check if a user has the required role to access a
specific route. */
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    // console.log('User Role Guard');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // console.log({ validRoles });
    // console.log({ userRoles: user.roles });

    if (!user) throw new BadRequestException('User not found');

    for (const role of validRoles) {
      if (user.roles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.id} does not have the required role`,
    );
  }
}

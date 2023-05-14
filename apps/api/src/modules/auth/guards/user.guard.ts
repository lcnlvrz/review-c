import { IJWTSessionClaims } from '../auth.controller'
import { USER_JWT_SERVICE } from '../user-jwt.module'
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { JWT_SESSION_COOKIE_NAME } from 'src/constants/cookie'
import { DatabaseService } from 'src/modules/database/database.service'

export const USER_REQUEST_KEY = 'user'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(USER_JWT_SERVICE)
    private readonly jwtService: JwtService,
    private readonly dbService: DatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const token =
      request.cookies[JWT_SESSION_COOKIE_NAME] ||
      request.header('Authorization')

    if (!token) {
      this.throwUnauthorized()
    }

    let claims: IJWTSessionClaims

    try {
      claims = this.jwtService.verify(token)
    } catch (err) {
      this.throwUnauthorized()
    }

    if (!claims.sub) {
      this.throwUnauthorized()
    }

    const user = await this.dbService.user.findFirst({
      where: {
        id: claims.sub,
      },
      select: {
        avatar: true,
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        memberships: true,
      },
    })

    if (!user) {
      this.throwUnauthorized()
    }

    request[USER_REQUEST_KEY] = user

    return true
  }

  private throwUnauthorized() {
    throw new UnauthorizedException({
      code: 'unauthorized',
      description: 'Unauthorized',
      status: HttpStatus.UNAUTHORIZED,
    })
  }
}

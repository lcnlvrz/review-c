import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'database'
import { Response } from 'express'
import { AppError } from 'src/common/error'
import {
  JWT_SESSION_COOKIE_NAME,
  JWT_SESSION_EXPIRES,
} from 'src/constants/cookie'
import { AuthService } from './auth.service'
import { ReqUser } from './decorators/user.decorator'
import { SignInUserDTO } from './dtos/sign-in-user.dto'
import { UserGuard } from './guards/user.guard'
import { USER_JWT_SERVICE } from './user-jwt.module'

export interface IJWTSessionClaims {
  sub: number
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(USER_JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  @Post('sign-in')
  async signInUser(@Body() dto: SignInUserDTO, @Res() res: Response) {
    const signIn = await this.authService.signInUser(dto)

    if (signIn instanceof AppError) {
      return signIn
    }

    const claims: IJWTSessionClaims = {
      sub: signIn.userId,
    }

    const token = await this.jwtService.sign(claims)

    res.cookie(JWT_SESSION_COOKIE_NAME, token, {
      maxAge: JWT_SESSION_EXPIRES,
    })

    return res.status(HttpStatus.OK).json({
      userId: signIn.userId,
    })
  }

  @Get('me')
  @UseGuards(UserGuard)
  async me(@ReqUser() user: User) {
    return user
  }
}

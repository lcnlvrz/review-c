import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleIDP } from './idp/google'
import { IdentityProvider } from './idp/idp'
import { UserJWTModule } from './user-jwt.module'

@Module({
  imports: [UserJWTModule, HttpModule],
  providers: [GoogleIDP, AuthService, IdentityProvider],
  controllers: [AuthController],
  exports: [UserJWTModule],
})
export class AuthModule {}

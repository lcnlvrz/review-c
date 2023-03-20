import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JWT_SESSION_EXPIRES } from 'src/constants/cookie'

export const USER_JWT_SERVICE = 'user_jwt_service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: JWT_SESSION_EXPIRES,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: USER_JWT_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [USER_JWT_SERVICE],
})
export class UserJWTModule {}

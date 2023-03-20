import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JWT_INVITATION_EXPIRES } from 'src/constants/cookie'

export const INVITATION_JWT_SERVICE = 'INVITATION_jwt_service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => {
        return {
          secret: configService.get('JWT_INVITATION_SECRET'),
          signOptions: {
            expiresIn: JWT_INVITATION_EXPIRES,
          },
        }
      },
    }),
  ],
  providers: [
    {
      provide: INVITATION_JWT_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [INVITATION_JWT_SERVICE],
})
export class InvitationJWTModule {}

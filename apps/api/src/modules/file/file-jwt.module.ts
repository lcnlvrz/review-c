import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JWT_SESSION_EXPIRES } from 'src/constants/cookie'
import { POST_PRESIGNED_URL_EXPIRATION_SECONDS } from 'src/constants/file'

export const FILE_JWT_SERVICE = 'file_jwt_service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_FILE_SECRET'),
        signOptions: {
          expiresIn: POST_PRESIGNED_URL_EXPIRATION_SECONDS,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: FILE_JWT_SERVICE,
      useExisting: JwtService,
    },
  ],
  exports: [FILE_JWT_SERVICE],
})
export class FileJWTModule {}

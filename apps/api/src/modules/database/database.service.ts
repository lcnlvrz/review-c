import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient, Workspace } from 'database'

export const DATABASE_URL = 'DATABASE_URL'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get(DATABASE_URL),
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}

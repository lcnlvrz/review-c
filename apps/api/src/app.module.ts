import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { DatabaseModule } from './modules/database/database.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

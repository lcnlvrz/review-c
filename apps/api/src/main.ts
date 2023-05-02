import { AppModule } from './app.module'
import { configApp } from './config'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  configApp(app)

  await app.listen(3003)
}
bootstrap()

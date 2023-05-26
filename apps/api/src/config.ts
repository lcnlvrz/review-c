import { ResponseInterceptor } from './common/response.interceptor'
import { DatabaseService } from './modules/database/database.service'
import { generateCorsMiddleware } from './utils/generate-cors-middleware'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

export const configApp = async (app: INestApplication) => {
  const prismaService = app.get<DatabaseService>(DatabaseService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.enableCors({
    origin: '*',
  })

  app.use((req, res, next) => {
    console.log('request received', req.path, req.method)

    next()
  })

  app.use(cookieParser())
}

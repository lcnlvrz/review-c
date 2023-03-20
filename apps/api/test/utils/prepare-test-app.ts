import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { configApp } from 'src/config'
import { v4 as uuid } from 'uuid'
import { execSync } from 'child_process'
import { DatabaseService } from 'src/modules/database/database.service'
import * as path from 'path'
import { executionAsyncId } from 'async_hooks'

const generateUniqueDatabaseName = (): string => {
  return `test_${uuid().replace(/-/g, '')}_${new Date().getTime()}`
}

export type TestAppDeps = Awaited<ReturnType<typeof prepareTestApp>>

export const prepareTestApp = async () => {
  const database = generateUniqueDatabaseName()

  execSync(
    `mysql --host=127.0.0.1 --port=3307 --user=root --password=admin -e 'CREATE DATABASE ${database};'`
  )

  process.env.DATABASE_URL = `mysql://root:admin@127.0.01:3307/${database}`

  const prismaPkg = path.join(__dirname, '../../../../packages/database')

  execSync(`cd ${prismaPkg} && npx prisma db push`, {
    env: process.env,
  })

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()

  configApp(app)

  await app.init()

  return {
    app,
    dbService: app.get(DatabaseService),
  }
}

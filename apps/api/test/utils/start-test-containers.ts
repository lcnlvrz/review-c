import { GenericContainer } from 'testcontainers'

export const startTestContainers = async () => {
  const genericContainer = await new GenericContainer('mysql:5.7')
    .withExposedPorts(3306)
    .withEnvironment({
      MYSQL_DATABASE: 'db',
      MYSQL_USER: 'admin',
      MYSQL_PASSWORD: 'admin',
      MYSQL_ROOT_PASSWORD: 'admin',
    })
    .start()

  process.env.DATABASE_URL = `mysql://admin:admin@${genericContainer.getHost()}:${genericContainer.getMappedPort(
    3306
  )}/test`

  return {
    down: async () => {
      await genericContainer.stop()
    },
  }
}

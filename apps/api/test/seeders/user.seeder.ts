import { DatabaseService } from 'src/modules/database/database.service'
import { faker } from '@faker-js/faker'
import { Provider } from 'database'

export const userSeeder = async (dbService: DatabaseService) => {
  const user = await dbService.user.create({
    data: {
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    },
  })

  await dbService.identityProvider.create({
    data: {
      provider: Provider.GOOGLE,
      providerId: faker.random.alpha(),
      userId: user.id,
    },
  })

  return {
    user,
  }
}

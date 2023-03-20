import { DatabaseService } from 'src/modules/database/database.service'
import { faker } from '@faker-js/faker'
import { Member, Provider, User } from 'database'

export const workspaceSeeder = async (
  dbService: DatabaseService,
  user: User,
  member?: Partial<Member>
) => {
  const workspace = await dbService.workspace.create({
    data: {
      name: faker.random.words(10),
      description: faker.random.words(100),
      members: {
        create: {
          role: 'OWNER',
          userId: user.id,
          ...member,
        },
      },
    },
  })

  return {
    workspace,
  }
}

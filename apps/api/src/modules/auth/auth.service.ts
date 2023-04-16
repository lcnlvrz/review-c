import { Injectable } from '@nestjs/common'
import { MemberRole, User } from 'database'
import { DatabaseService } from '../database/database.service'
import { SignInUserDTO } from './dtos/sign-in-user.dto'
import { IdentityProvider } from './idp/idp'
const nanoid = require('nanoid')

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly idp: IdentityProvider
  ) {}

  async signInUser(input: SignInUserDTO) {
    const idp = await this.idp.auth(input.provider, input.token)

    if (!idp.success) {
      return idp.error
    }

    let user: User

    const identityProvider = await this.dbService.identityProvider.findFirst({
      where: {
        providerId: idp.data.idpID,
      },
      include: {
        user: true,
      },
    })

    if (identityProvider) {
      user = identityProvider.user
    }

    if (!identityProvider) {
      const userFields = {
        avatar: idp.data.avatar,
        email: idp.data.email,
        firstName: idp.data.firstName,
        lastName: idp.data.lastName,
      }

      const _user = await this.dbService.user.upsert({
        where: {
          email: idp.data.email,
        },
        create: {
          ...userFields,
          identityProviders: {
            create: {
              provider: input.provider,
              providerId: idp.data.idpID,
            },
          },
        },
        update: userFields,
      })

      user = _user
    }

    if (input.force_ws) {
      const workspace = await this.dbService.workspace.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          userId: true,
        },
      })

      if (!workspace) {
        await this.dbService.workspace.create({
          data: {
            id: nanoid.nanoid(),
            description: 'My first workspace',
            name: `${user.firstName}'s workspace`,
            userId: user.id,
            members: {
              create: {
                userId: user.id,
                role: MemberRole.ADMIN,
              },
            },
          },
        })
      }
    }

    return {
      userId: user.id,
    }
  }

  async listInvitations(input: { user: User }) {
    return await this.dbService.invitation.findMany({
      where: {
        email: input.user.email,
      },
    })
  }
}

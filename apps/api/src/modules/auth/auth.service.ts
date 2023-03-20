import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { SignInUserDTO } from './dtos/sign-in-user.dto'
import { IdentityProvider } from './idp/idp'

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

    let userId: number

    const identityProvider = await this.dbService.identityProvider.findFirst({
      where: {
        providerId: idp.data.idpID,
      },
    })

    if (identityProvider) {
      userId = identityProvider.userId
    }

    if (!identityProvider) {
      const userFields = {
        avatar: idp.data.avatar,
        email: idp.data.email,
        firstName: idp.data.firstName,
        lastName: idp.data.lastName,
      }

      const user = await this.dbService.user.upsert({
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

      userId = user.id
    }

    return {
      userId,
    }
  }
}

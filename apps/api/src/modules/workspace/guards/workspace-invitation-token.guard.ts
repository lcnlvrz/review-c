import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { DatabaseService } from 'src/modules/database/database.service'
import { INVITATION_JWT_SERVICE } from '../invitation-jwt.module'
import { IJWTInvitationClaims } from '../workspace.service'

export const INVITATION_REQUEST_KEY = 'invitation'

@Injectable()
export class WorkspaceInvitationTokenGuard implements CanActivate {
  constructor(
    private readonly dbService: DatabaseService,
    @Inject(INVITATION_JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const bearerToken = request.header('Authorization') || ''

    const separator = 'Bearer '

    if (!bearerToken || bearerToken.split(separator).length !== 2) {
      throw new UnauthorizedException()
    }

    const [_, token] = bearerToken.split(separator)

    let claims: IJWTInvitationClaims

    try {
      claims = await this.jwtService.verify(token)
    } catch (err) {
      throw new UnauthorizedException()
    }

    const invitation = await this.dbService.invitation.findFirst({
      where: {
        token,
        email: claims.sub,
      },
    })

    if (!invitation) {
      throw new UnauthorizedException()
    }

    request[INVITATION_REQUEST_KEY] = invitation

    return true
  }
}

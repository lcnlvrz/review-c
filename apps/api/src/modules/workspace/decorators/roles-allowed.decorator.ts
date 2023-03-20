import { applyDecorators, SetMetadata } from '@nestjs/common'
import { MemberRole } from 'database'

export const ROLES_ALLOWED_METADATA_KEY = 'roles_allowed'

export const RolesAllowed = (...roles: MemberRole[]) =>
  SetMetadata(ROLES_ALLOWED_METADATA_KEY, roles)

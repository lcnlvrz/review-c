import { IsString, IsUUID } from 'class-validator'

export class WorkspaceParamDTO {
  @IsString()
  @IsUUID()
  workspaceId: string
}

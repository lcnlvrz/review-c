import { IsString } from 'class-validator'

export class WorkspaceParamDTO {
  @IsString()
  workspaceId: string
}

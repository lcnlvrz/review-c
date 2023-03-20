import { PartialType } from '@nestjs/mapped-types'
import { CreateWorkspaceDTO } from './create-workspace.dto'

export class UpdateWorkspaceDTO extends PartialType(CreateWorkspaceDTO) {}

import { Injectable } from '@nestjs/common'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import { CreateReviewOutput, ListReviewsOutput } from 'common'
import * as crypto from 'crypto'
import { User, Workspace } from 'database'
import { DatabaseService } from '../database/database.service'
import { CreateReviewPipeOutput } from './pipes/create-review.pipe'
const nanoid = require('nanoid')

@Injectable()
export class ReviewService {
  constructor(private readonly dbService: DatabaseService) {}

  async createReview(
    workspace: Workspace,
    user: User,
    input: CreateReviewPipeOutput
  ): Promise<CreateReviewOutput> {
    let reviewId: string

    await this.dbService.$transaction(async (trx) => {
      const fields = await (async () => {
        switch (input.type) {
          case 'FILE': {
            const file = await trx.file.create({
              data: {
                originalFilename: input.file.claims.originalFilename,
                size: input.file.objectMetadata.size,
                storedKey: input.file.claims.keyStored,
              },
            })

            return {
              fileId: file.id,
              type: input.type,
            }
          }

          case 'URL':
            return {
              type: input.type,
              url: input.url,
            }
        }
      })()

      const token = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex')

      const review = await trx.review.create({
        data: {
          workspaceId: workspace.id,
          id: nanoid.nanoid(),
          fileId: fields.fileId,
          url: fields.url,
          type: fields.type,
          users: {
            create: {
              role: 'OWNER',
              userId: user.id,
            },
          },
          token,
        },
      })

      reviewId = review.id
    })

    return {
      reviewId,
    }
  }

  async listReviews(workspace: Workspace): Promise<ListReviewsOutput> {
    const reviews = await this.dbService.review.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        users: true,
      },
    })

    return {
      reviews,
    }
  }
}

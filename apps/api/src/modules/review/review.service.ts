import { DatabaseService } from '../database/database.service'
import { CreateReviewPipeOutput } from './pipes/create-review.pipe'
import { StartReviewThreadPipeOutput } from './pipes/start-review-thread.pipe'
import { Injectable } from '@nestjs/common'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import {
  CreateReviewOutput,
  ListReviewsOutput,
  RetrieveReviewDetailOutput,
} from 'common'
import * as crypto from 'crypto'
import { Review, User, Workspace } from 'database'

const nanoid = require('nanoid')

@Injectable()
export class ReviewService {
  constructor(private readonly dbService: DatabaseService) {}

  async startThread(input: {
    user: User
    workspace: Workspace
    review: Review
    dto: StartReviewThreadPipeOutput
  }) {
    const thread = await this.dbService.thread.create({
      data: {
        xPath: input.dto.xPath,
        xPercentage: input.dto.xPercentage,
        yPercentage: input.dto.yPercentage,
        reviewId: input.review.id,
        messages: {
          create: [
            {
              content: input.dto.message,
              sentById: input.user.id,
              files: {
                create: input.dto.files.map((file) => {
                  return {
                    originalFilename: file.originalFilename,
                    size: file.size,
                    storedKey: file.storedKey,
                  }
                }),
              },
            },
          ],
        },
      },
    })

    return {
      threadId: thread.id,
    }
  }

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
                storedKey: input.file.claims.storedKey,
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
          title: input.title,
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

  async retrieveReviewDetail(reviewId: string) {
    return await this.dbService.review.findFirst({
      where: {
        id: reviewId,
      },
      include: {
        threads: {
          include: {
            messages: {
              include: {
                sentBy: true,
                files: true,
              },
            },
          },
        },
      },
    })
  }
}

import type { IPresignedPostURL } from 'common'
import { httpClient } from '@/http/client'

export class FileService {
  static async presignedPostURL(input: {
    filename: string
    mimetype: string
  }): Promise<IPresignedPostURL> {
    return await httpClient
      .post('/file/presigned', input)
      .then((res) => res.data)
  }
}

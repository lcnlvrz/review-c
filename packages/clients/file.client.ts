import { httpClient } from './http.client'
import type { IPresignedPostURL } from 'common'

export class FileClient {
  static async presignedPostURL(input: {
    filename: string
    mimetype: string
  }): Promise<IPresignedPostURL> {
    return await httpClient
      .post('/file/presigned', input)
      .then((res) => res.data as IPresignedPostURL)
  }
}

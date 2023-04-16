export interface IPresignedPostURL {
  token: string
  url: string
  fields: {
    [key: string]: any
  }
}

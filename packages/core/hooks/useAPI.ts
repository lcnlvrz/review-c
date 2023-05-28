import { useHTTPClient } from '../providers/HTTPClientProvider'
import { ReviewClient, WorkspacesClient, FileClient } from 'clients'

const clients = {
  workspace: WorkspacesClient,
  review: ReviewClient,
  file: FileClient,
}

export const useAPI = <T extends keyof typeof clients>(
  api: T
): (typeof clients)[T]['prototype'] => {
  const { httpClient } = useHTTPClient()

  console.log('httpClient', httpClient.headers)

  return new clients[api](httpClient)
}

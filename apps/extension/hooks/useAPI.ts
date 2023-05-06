import { ReviewClient, WorkspacesClient } from 'clients'
import { useHTTPClient } from '~providers/HTTPClientProvider'

const clients = {
  workspace: WorkspacesClient,
  review: ReviewClient,
}

export const useAPI = <T extends keyof typeof clients>(
  api: T
): (typeof clients)[T]['prototype'] => {
  const { httpClient } = useHTTPClient()

  console.log('httpClient', httpClient)

  return new clients[api](httpClient)
}

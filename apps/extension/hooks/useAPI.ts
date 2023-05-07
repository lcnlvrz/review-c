import { ReviewClient, WorkspacesClient, FileClient } from 'clients'
import { useHTTPClient } from '~providers/HTTPClientProvider'

const clients = {
  workspace: WorkspacesClient,
  review: ReviewClient,
  file: FileClient,
}

export const useAPI = <T extends keyof typeof clients>(
  api: T
): (typeof clients)[T]['prototype'] => {
  const { httpClient } = useHTTPClient()

  return new clients[api](httpClient)
}

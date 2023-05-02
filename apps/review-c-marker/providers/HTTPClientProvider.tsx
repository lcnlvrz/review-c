import { httpClient } from 'clients'
import React, { createContext, useContext } from 'react'

interface HTTPClientContext {
  httpClient: typeof httpClient
}

const HTTPClientContext = createContext<HTTPClientContext>({
  httpClient: {} as any,
})

export const useHTTPClient = () => useContext(HTTPClientContext)

export const HTTPClientProvider = (
  props: React.PropsWithChildren<{
    httpClient: typeof httpClient
  }>
) => {
  return (
    <HTTPClientContext.Provider value={props}>
      {props.children}
    </HTTPClientContext.Provider>
  )
}

import React from "react"

import { useHost } from "~hooks/useHost"

export const WaitForHost = (props: {
  children: React.FC<{ host: string }>
}) => {
  const { isLoading, host } = useHost()

  if (isLoading || !host) {
    return null
  }

  return (
    <>
      {props.children({
        host
      })}
    </>
  )
}

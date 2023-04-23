import { useEffect, useState } from "react"

import { resolveHost } from "~lib/resolve-host"

export const useHost = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [host, setHost] = useState("")

  useEffect(() => {
    resolveHost().then((res) => {
      setHost(res)
      setIsLoading(false)
    })
  }, [])

  return {
    host,
    setHost,
    isLoading
  }
}

import { useEffect, useState } from 'react'
import { resolveHost, type Host } from '~lib/resolve-host'

export const useHost = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [host, setHost] = useState<Host>()

  useEffect(() => {
    resolveHost().then((res) => {
      setHost(res)
      setIsLoading(false)
    })
  }, [])

  return {
    host,
    setHost,
    isLoading,
  }
}

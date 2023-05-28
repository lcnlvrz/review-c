import React from 'react'
import { useHost } from '~hooks/useHost'
import type { Host } from '~lib/resolve-host'

export const PORTAL_ID = 'review-c-portal-id'
export const EXTRA_PORTAL_ID = 'review-c-extra-portal-id'

export const WaitForHost = (props: { children: React.FC<{ host: Host }> }) => {
  const { isLoading, host } = useHost()

  if (isLoading || !host) {
    return null
  }

  return (
    <>
      {props.children({
        host,
      })}
      <div id={PORTAL_ID} />
    </>
  )
}

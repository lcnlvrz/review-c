import React from 'react'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { withWorkspaces } from '@/ssr/withWorkspaces'
import { DashboardLayout } from '@/components/DashboardLayout'

const workspace = (props: InferCompose<typeof getServerSideProps>) => {
  return (
    <DashboardLayout {...props}>
      <div className="flex flex-col">testing</div>
    </DashboardLayout>
  )
}

export const getServerSideProps = compose(
  withAuth,
  withWorkspaces,
  withCurrentWorkspace
)

export default workspace

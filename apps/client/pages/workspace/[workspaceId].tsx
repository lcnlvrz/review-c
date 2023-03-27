import { Button } from '@/components/Button'
import { CreateReview } from '@/components/CreateReview'
import { DashboardLayout } from '@/components/DashboardLayout'
import { compose, COMPOSE_DEFAULT_MODE, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { withWorkspaces } from '@/ssr/withWorkspaces'
import { Plus } from 'lucide-react'

const workspace = (props: InferCompose<typeof getServerSideProps>) => {
  return (
    <DashboardLayout {...props}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold text-2xl">Reviews</h2>
          <CreateReview />
        </div>
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps = compose(
  COMPOSE_DEFAULT_MODE,
  withAuth(),
  withWorkspaces,
  withCurrentWorkspace
)

export default workspace

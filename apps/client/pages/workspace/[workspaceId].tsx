import { CreateReview } from '@/components/CreateReview'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ReviewsList } from '@/components/ReviewsList'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { withReviews } from '@/ssr/withReviews'
import { withWorkspaces } from '@/ssr/withWorkspaces'

const workspace = (props: InferCompose<typeof getServerSideProps>) => {
  return (
    <DashboardLayout {...props}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold text-2xl">Reviews</h2>
          <CreateReview />
        </div>
        <ReviewsList reviews={props.reviews} />
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps = compose(
  'sequential',
  withAuth(),
  withWorkspaces,
  withCurrentWorkspace,
  withReviews
)

export default workspace

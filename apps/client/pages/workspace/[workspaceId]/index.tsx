import { CreateReview } from '@/components/CreateReview'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ReviewsTable } from '@/components/ReviewsTable'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { withReviews } from '@/ssr/withReviews'
import { withWorkspaces } from '@/ssr/withWorkspaces'

const workspace = (props: InferCompose<typeof getServerSideProps>) => {
  return (
    <DashboardLayout {...props}>
      <div className="flex flex-col space-y-3">
        <h2 className="font-bold text-2xl">Reviews</h2>
        <ReviewsTable reviews={props.reviews} />
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps = compose(
  'parallel',
  withAuth(),
  withWorkspaces,
  withCurrentWorkspace,
  withReviews
)

export default workspace

import { CreateReview } from '@/components/CreateReview'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DetailReview } from '@/components/DetailReview'
import { ReviewDetailProvider } from '@/providers/ReviewDetailProvider'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { withReviewDetail } from '@/ssr/withReviewDetail'
import { withWorkspaces } from '@/ssr/withWorkspaces'

const reviewDetail = (props: InferCompose<typeof getServerSideProps>) => {
  return (
    <DashboardLayout {...props}>
      <ReviewDetailProvider review={props.review}>
        <DetailReview />
      </ReviewDetailProvider>
    </DashboardLayout>
  )
}

export const getServerSideProps = compose(
  'parallel',
  withAuth(),
  withWorkspaces,
  withCurrentWorkspace,
  withReviewDetail
)

export default reviewDetail

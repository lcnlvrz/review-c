import { FileReviewDetail } from './FileReviewDetail'
import { WebsiteReviewDetail } from './WebsiteReviewDetail'
import { useReviewDetail } from '@/providers/ReviewDetailProvider'

const ReviewTypesDetail = () => {
  const review = useReviewDetail()

  switch (review.type) {
    case 'WEBSITE':
      return <WebsiteReviewDetail />

    case 'FILE':
      return <FileReviewDetail />
  }
}

export const DetailReview = () => {
  const review = useReviewDetail()

  return (
    <div>
      <div className="flex flex-col space-y-5">
        <div>
          <div className="font-bold text-3xl space-y-3">
            <h1>Reviews</h1>
            <h2 className="text-5xl text-gray-300">{review.title}</h2>
          </div>
          <ReviewTypesDetail />
        </div>
      </div>
    </div>
  )
}

import { useReviewDetail } from '@/providers/ReviewDetailProvider'
import dynamic from 'next/dynamic'
import React from 'react'
import { Badge } from 'ui'

const FileViewer = dynamic(() => import('./FileViewer'), { ssr: false })

export const FileReviewDetail = () => {
  const review = useReviewDetail()

  if (review.file) {
    return (
      <div>
        <Badge className="mt-5">{review.type}</Badge>
        <div>
          <FileViewer
            src={review.file.url || ''}
            extension={review.file.originalFilename.split('.').pop() || ''}
          />
        </div>
      </div>
    )
  }
}

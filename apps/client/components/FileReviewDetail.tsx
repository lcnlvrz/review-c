import { FileViewer } from './FileViewer'
import { useReviewDetail } from '@/providers/ReviewDetailProvider'
import React from 'react'
import { Badge } from 'ui'

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

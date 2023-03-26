import React from 'react'

export const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-4 rounded w-5/6"></div>
    </div>
  )
}

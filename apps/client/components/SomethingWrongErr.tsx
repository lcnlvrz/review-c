import React from 'react'

export const SomethingWrongErr = () => {
  return (
    <div
      className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4`}
      role="alert"
    >
      <p>Something went wrong</p>
    </div>
  )
}

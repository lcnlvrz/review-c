import type { File } from 'database'
import React from 'react'

const ImageViewer = (props: { src: string }) => {
  return (
    <div>
      <img
        onClick={(event) => {
          console.log('event', event)
        }}
        src={props.src}
      />
    </div>
  )
}

export const FileViewer = (props: { extension: string; src: string }) => {
  switch (props.extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <ImageViewer src={props.src} />

    default:
      return null
  }
}

export const reviewTypes = ['URL', 'FILE'] as const

export type ReviewType = (typeof reviewTypes)[number]

export const reviewTypesOpts: {
  type: ReviewType
  label: string
  context: string
}[] = [
  {
    type: 'URL',
    label: 'URL',
    context: 'Review a website',
  },
  {
    type: 'FILE',
    label: 'File',
    context: 'Review a document',
  },
]

export const reviewTypes = ['WEBSITE', 'FILE'] as const

export type ReviewType = (typeof reviewTypes)[number]

export const reviewTypesOpts: {
  type: ReviewType
  label: string
  context: string
}[] = [
  {
    type: 'WEBSITE',
    label: 'Website',
    context: 'Review a website',
  },
  {
    type: 'FILE',
    label: 'File',
    context: 'Review a document',
  },
]

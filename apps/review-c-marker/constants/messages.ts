export const messages = ["start-review"] as const

export type Message = (typeof messages)[number]

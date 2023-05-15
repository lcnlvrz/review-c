export const safeURLParse = (url?: string) => {
  try {
    return new URL(url)
  } catch (err) {
    return
  }
}

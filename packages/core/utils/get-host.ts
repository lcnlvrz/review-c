export const getHostFromURL = (url: string): string => {
  const urlObj = new URL(url)
  return urlObj.host
}

export const fileToBase64 = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = reject
  })
}

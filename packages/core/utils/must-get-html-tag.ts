export const mustGetHtmlTag = () => {
  const html = window.document.getElementsByTagName('html').item(0)

  if (!html) {
    throw new Error('html tag not found')
  }

  return html
}

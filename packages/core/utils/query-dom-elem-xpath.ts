export const queryDomElemXPath = (xpath: string) => {
  return window.document.evaluate(
    xpath,
    window.document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE
  )?.singleNodeValue as HTMLElement
}

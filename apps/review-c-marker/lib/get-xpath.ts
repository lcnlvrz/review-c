const ELEMENT_NODE_TYPE = 1

const iterateElement = (element: HTMLElement): string => {
  if (!!element.id) return "//*[@id='" + element.id + "']"

  if (element === document.body) return element.tagName.toLowerCase()

  var ix = 0
  const siblings = element.parentNode.childNodes
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i]

    if (sibling === element) {
      return (
        iterateElement(element.parentNode as HTMLElement) +
        '/' +
        element.tagName.toLowerCase() +
        '[' +
        (ix + 1) +
        ']'
      )
    }

    if (
      sibling.nodeType === ELEMENT_NODE_TYPE &&
      'tagName' in sibling &&
      sibling.tagName === element.tagName
    ) {
      ix++
    }
  }
}

export const getXPath = (element: HTMLElement): string => {
  const path = iterateElement(element)

  if (path.startsWith('//')) {
    return path
  }

  return `/html/${path}`
}

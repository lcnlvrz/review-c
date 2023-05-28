import { TEXT_NODE_TYPE } from '../components/GridMarkers'
import { queryDomElemXPath } from './query-dom-elem-xpath'
import { Selection } from 'database'

const findTextNode = (node: Node): Node | null => {
  if (node.nodeType === TEXT_NODE_TYPE) return node

  let textNode: Node | null = null

  node.childNodes.forEach((childNode) => {
    if (childNode.nodeType === TEXT_NODE_TYPE) {
      textNode = childNode
    }
  })

  return textNode
}

export const createSafeNodeRange = (selection: Omit<Selection, 'id'>) => {
  const range = window.document.createRange()

  const startContainer = queryDomElemXPath(selection.startContainerXPath)
  const endContainer = queryDomElemXPath(selection.endContainerXPath)

  if (!startContainer || !endContainer) {
    return range
  }

  const startNode = startContainer.childNodes.item(
    selection.startChildrenNodeIndex
  )

  const endNode = endContainer.childNodes.item(selection.endChildrenNodeIndex)

  range.setStart(startNode, selection.startOffset)
  range.setEnd(endNode, selection.endOffset)

  return range
}

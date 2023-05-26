import { EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME } from './is-extension-dom'

export const getContentShadowDomRef = (portalId: string = '') => {
  if (!portalId) {
    return
  }

  return window.document
    .querySelector(EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME)
    .shadowRoot.getElementById(portalId)
}

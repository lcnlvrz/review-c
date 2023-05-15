import { EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME } from './is-extension-dom'
import { PORTAL_ID } from '~components/WaitForHost'

export const getContentShadowDomRef = (portalId: string = PORTAL_ID) =>
  window.document
    .querySelector(EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME)
    .shadowRoot.getElementById(portalId)

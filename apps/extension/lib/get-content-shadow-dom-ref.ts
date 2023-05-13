import { EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME } from './is-extension-dom'
import { PORTAL_ID } from '~components/WaitForHost'

export const getContentShadowDomRef = () =>
  window.document
    .querySelector(EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME)
    .shadowRoot.getElementById(PORTAL_ID)

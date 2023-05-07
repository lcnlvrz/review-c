export const EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME = 'plasmo-csui'

export const isExtensionDOM = (ele: HTMLElement) =>
  ele.tagName.toLowerCase() === EXTENSION_SHADOW_ROOT_CONTAINER_TAG_NAME

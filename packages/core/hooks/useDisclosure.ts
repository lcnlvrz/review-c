import { useCallback, useState } from 'react'

export type UseDisclosureProps = ReturnType<typeof useDisclosure>

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => setIsOpen(true), [])

  const onClose = useCallback(() => setIsOpen(false), [])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, onOpen, onClose, setIsOpen, toggle }
}

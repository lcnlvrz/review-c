import type { PagePropsMergedMap } from '@/ssr/compose'
import { atom, useAtomValue } from 'jotai'

export interface PagePropsAtom extends PagePropsMergedMap {}

export const pagePropsAtom = atom({} as PagePropsAtom)

export const currentWorkspaceAtom = atom(
  (get) => get(pagePropsAtom).currentWorkspace
)

export const authAtom = atom((get) => get(pagePropsAtom).auth)

export const useCurrentWorkspace = () => useAtomValue(currentWorkspaceAtom)

export const useAuth = () => useAtomValue(authAtom)

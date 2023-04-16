import '@/styles/globals.css'
import { Provider as JotaiProvider, createStore } from 'jotai'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { Montserrat } from '@next/font/google'
import { Toaster } from '@/components/Toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { compose, InferCompose } from '@/ssr/compose'
import type { withAuth } from '@/ssr/withAuth'
import type { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { WorkspaceProvider } from '@/providers/WorkspaceProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { useSetAtom } from 'jotai'
import { pagePropsAtom } from '@/atoms/pageProps'

export const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

const AtomRefreshers = (
  props: React.PropsWithChildren<{
    pageProps: any
  }>
) => {
  const setPagePropsAtom = useSetAtom(pagePropsAtom)

  useEffect(() => {
    setPagePropsAtom(props.pageProps)
  }, [props.pageProps])

  return <>{props.children}</>
}

export default function App({ Component, pageProps }: AppProps<any>) {
  const [queryClient, setQueryClient] = useState(new QueryClient())

  const store = createStore()
  store.set(pagePropsAtom, pageProps)

  return (
    //TODO: introduce jotai atoms for distribute pageProps across components
    <QueryClientProvider client={queryClient}>
      <AuthProvider auth={pageProps.auth}>
        <WorkspaceProvider currentWorkspace={pageProps.currentWorkspace}>
          <main className={`${montserrat.variable} font-sans`}>
            <style jsx global>{`
              :root {
                --dm-font: ${montserrat.style.fontFamily};
              }
            `}</style>
            <Toaster />
            <NextNProgress />
            <JotaiProvider store={store}>
              <AtomRefreshers pageProps={pageProps}>
                <Component {...pageProps} />
              </AtomRefreshers>
            </JotaiProvider>
          </main>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

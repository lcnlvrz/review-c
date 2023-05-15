import { pagePropsAtom } from '@/atoms/pageProps'
import { Toaster } from '@/components/Toaster'
import { AuthProvider } from '@/providers/AuthProvider'
import { WorkspaceProvider } from '@/providers/WorkspaceProvider'
import '../styles.css'
import { Montserrat } from '@next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider, createStore, useSetAtom } from 'jotai'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useState } from 'react'

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

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { Montserrat } from '@next/font/google'
import { Toaster } from '@/components/Toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { compose, InferCompose } from '@/ssr/compose'
import type { withAuth } from '@/ssr/withAuth'
import type { withCurrentWorkspace } from '@/ssr/withCurrentWorkspace'
import { WorkspaceProvider } from '@/providers/WorkspaceProvider'
import { AuthProvider } from '@/providers/AuthProvider'

export const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export default function App({
  Component,
  pageProps,
}: AppProps<
  InferCompose<typeof withCurrentWorkspace> &
    InferCompose<ReturnType<typeof withAuth>>
>) {
  const [queryClient, setQueryClient] = useState(new QueryClient())

  console.log('pageProps.currentWorkspace', pageProps.currentWorkspace)

  return (
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
            <Component {...pageProps} />
          </main>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

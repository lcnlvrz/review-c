import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { Montserrat } from '@next/font/google'
import { Toaster } from '@/components/Toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient, setQueryClient] = useState(new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

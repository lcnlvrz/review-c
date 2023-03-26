import { DashboardLayout } from '@/components/DashboardLayout'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withWorkspaces } from '@/ssr/withWorkspaces'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

type Props = InferCompose<typeof getServerSideProps>

export default function Home(props: Props) {
  return <DashboardLayout />
}

export const getServerSideProps = compose(withAuth, withWorkspaces)

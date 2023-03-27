import { compose, COMPOSE_DEFAULT_MODE, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withWorkspaces } from '@/ssr/withWorkspaces'

type Props = InferCompose<typeof getServerSideProps>

export default function Home(props: Props) {
  return <></>
}

export const getServerSideProps = compose(
  COMPOSE_DEFAULT_MODE,
  withAuth(),
  withWorkspaces
)

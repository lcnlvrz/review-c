import { Button } from '@/components/Button'
import { PublicLayout } from '@/components/PublicLayout'
import { useError } from '@/hooks/useError'
import { WorkspaceService } from '@/services/workspace.service'
import { compose, InferCompose } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withInvitation } from '@/ssr/withInvitation'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

type Props = InferCompose<typeof getServerSideProps>

const invitation = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const error = useError()

  const onInvite = useCallback(() => {
    setIsLoading(true)
    WorkspaceService.acceptInvitation(props.invitation.id)
      .then((res) => {
        router.push(`/workspace/${props.invitation.workspace.id}`)
      })
      .catch((err) => {
        error.handleError(err)
        setIsLoading(false)
      })
  }, [])

  return (
    <PublicLayout className="sm:max-w-2xl">
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col space-y-2">
          <h1 className="font-bold text-2xl">
            You're invited to join {props.invitation.workspace.name}
          </h1>
          <p>
            <strong>
              {props.invitation.invitedBy.firstName}{' '}
              {props.invitation.invitedBy.lastName}{' '}
            </strong>{' '}
            ({props.invitation.invitedBy.email}) invited you to join{' '}
            {props.invitation.workspace.name} workspace.
          </p>
        </div>
        <div className="mt-10 w-full flex items-end justify-end">
          <div className="flex flex-row space-x-2">
            <Button disabled={isLoading} variant={'outline'}>
              Cancel
            </Button>
            <Button isLoading={isLoading} onClick={onInvite}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export const getServerSideProps = compose(
  'sequential',
  withAuth({
    force_ws: 'false',
  }),
  withInvitation
)

export default invitation

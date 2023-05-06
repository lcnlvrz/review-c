import { Skeleton } from './Skeleton'
import { FolderEdit } from 'lucide-react'
import { useReviewSession } from '~hooks/useReviewSession'

export const SignOutReviewSession = (props: { host: string }) => {
  const { currentReviewSession, stopReviewSession } = useReviewSession(
    props.host
  )

  if (!currentReviewSession) {
    return <Skeleton />
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-row space-x-2">
        <FolderEdit className="mt-1" />
        <h1 className="font-bold text-2xl">Reviewing</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h2 className="font-bold">Host</h2>
          <p className="truncate max-w-xl">{props.host}</p>
        </div>
        <div>
          <h2 className="font-bold">Workspace</h2>
          <p>{currentReviewSession.workspace.name}</p>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => stopReviewSession()}
          className="rounded-3xl bg-red-500 w-full px-6 py-1 text-lg font-medium text-white"
        >
          Stop Review
        </button>
      </div>
    </div>
  )
}

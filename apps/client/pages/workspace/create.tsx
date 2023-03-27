import React, { useCallback, useState } from 'react'
import { compose, COMPOSE_DEFAULT_MODE } from '@/ssr/compose'
import { withAuth } from '@/ssr/withAuth'
import { withWorkspaces } from '@/ssr/withWorkspaces'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PublicLayout } from '@/components/PublicLayout'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { Button } from '@/components/Button'
import { useForm } from 'react-hook-form'
import { workspaceSchema, WorkspaceSchema } from '@/schemas/workspace.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextErrorMessage } from '@/components/TextErrorMessage'
import { WorkspaceService } from '@/services/workspace.service'
import { Textarea } from '@/components/Textarea'
import { useRouter } from 'next/router'
import { useError } from '@/hooks/useError'

const create = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
  })

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const error = useError()

  const onCreateWorkspace = useCallback((data: WorkspaceSchema) => {
    setIsLoading(true)

    WorkspaceService.createWorkspace(data)
      .then((res) => {
        router.push(`/workspace/${res.workspaceId}`)
      })
      .catch((err) => {
        error.handleError(err)
        setIsLoading(false)
      })
  }, [])

  return (
    <PublicLayout>
      <div className="flex flex-col space-y-10">
        <h1 className="font-bold text-2xl">Create a new workspace</h1>
        <form
          onSubmit={handleSubmit(onCreateWorkspace)}
          className="flex flex-col space-y-4"
        >
          <div>
            <Label>Name</Label>
            <Input {...register('name')} />
            {errors.name && (
              <TextErrorMessage>{errors.name.message}</TextErrorMessage>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
            {errors.description && (
              <TextErrorMessage>{errors.description.message}</TextErrorMessage>
            )}
          </div>
          <Button isLoading={isLoading} type="submit" className="w-full">
            Create
          </Button>
        </form>
      </div>
    </PublicLayout>
  )
}

export default create

export const getServerSideProps = compose(
  COMPOSE_DEFAULT_MODE,
  withAuth(),
  withWorkspaces
)

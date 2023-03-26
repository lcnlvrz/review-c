import axios from 'axios'
import { useCallback } from 'react'
import { useToast } from './useToast'

export const useError = () => {
  const { toast } = useToast()

  const getErrorProps = useCallback(
    (error: any | unknown): Parameters<typeof toast>[0] => {
      const defaultError = {
        title: 'Something went wrong',
        description: 'Please try again later',
      }

      if (axios.isAxiosError<{ code: string; emails?: string[] }>(error)) {
        switch (error?.response?.data.code) {
          case 'members_already_exist':
            return {
              title: 'Members already exist',
              description: (
                <div>
                  <p>The following members already exist:</p>
                  <ul>
                    {error?.response?.data?.emails?.map((email) => {
                      return <li>{email}</li>
                    })}
                  </ul>
                </div>
              ),
            }

          default:
            return defaultError
        }
      }

      return defaultError
    },
    []
  )

  const handleError = useCallback(
    (error: any | unknown) => toast(getErrorProps(error)),
    []
  )

  return {
    handleError,
    getErrorProps,
  }
}

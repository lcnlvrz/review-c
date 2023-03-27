import { Button } from '@/components/Button'
import { PublicLayout } from '@/components/PublicLayout'
import Link from 'next/link'
import React from 'react'

const invalidInvitation = () => {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center space-y-5">
        <p className="font-bold">This invitation is no longer valid.</p>
        <Link href={'/'}>
          <Button>Back to home</Button>
        </Link>
      </div>
    </PublicLayout>
  )
}

export default invalidInvitation

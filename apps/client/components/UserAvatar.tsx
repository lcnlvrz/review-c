import type { User } from '.prisma/client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

export const UserAvatar = (props: { user: User }) => {
  return (
    <Avatar>
      <AvatarImage src={props.user.avatar} />
      <AvatarFallback className="uppercase">
        {props.user.firstName[0] + props.user.lastName[0]}
      </AvatarFallback>
    </Avatar>
  )
}

import type { User } from 'database'

export const composeUserName = (user: Pick<User, 'firstName' | 'lastName'>) => {
  return user.firstName + ' ' + user.lastName
}

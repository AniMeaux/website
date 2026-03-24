import type { User } from "@animeaux/prisma"
import invariant from "tiny-invariant"
import type { Except } from "type-fest"

import { Avatar } from "#i/core/data-display/avatar.js"
import { inferInstanceColor } from "#i/core/data-display/instance-color.js"

export function UserAvatar({
  user,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  user: Pick<User, "id" | "displayName">
}) {
  const firstLetter = user.displayName[0]
  invariant(firstLetter != null, "A user must have a non empty display name")

  return (
    <Avatar {...props} color={inferInstanceColor(user.id)}>
      {firstLetter.toUpperCase()}
    </Avatar>
  )
}

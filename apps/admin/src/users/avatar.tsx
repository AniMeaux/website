import { Avatar } from "#core/dataDisplay/avatar.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import type { User } from "@prisma/client";
import invariant from "tiny-invariant";
import type { Except } from "type-fest";

export function UserAvatar({
  user,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  user: Pick<User, "id" | "displayName">;
}) {
  const firstLetter = user.displayName[0];
  invariant(firstLetter != null, "A user must have a non empty display name");

  return (
    <Avatar {...props} color={inferInstanceColor(user.id)}>
      {firstLetter.toUpperCase()}
    </Avatar>
  );
}

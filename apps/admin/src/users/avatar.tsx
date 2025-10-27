import { Avatar } from "#core/data-display/avatar";
import { inferInstanceColor } from "#core/data-display/instance-color";
import type { User } from "@animeaux/prisma/client";
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

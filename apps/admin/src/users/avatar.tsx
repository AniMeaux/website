import { Avatar, AvatarProps } from "#core/dataDisplay/avatar.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { User } from "@prisma/client";
import invariant from "tiny-invariant";

export function UserAvatar({
  user,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  user: Pick<User, "id" | "displayName">;
}) {
  const firstLetter = user.displayName[0];
  invariant(firstLetter != null, "A user must have a non empty display name");

  return (
    <Avatar
      {...props}
      color={inferInstanceColor(user.id)}
      letter={firstLetter.toUpperCase()}
    />
  );
}

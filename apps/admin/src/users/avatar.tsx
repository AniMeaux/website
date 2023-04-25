import { User } from "@prisma/client";
import { Avatar, AvatarProps } from "~/core/dataDisplay/avatar";
import { inferInstanceColor } from "~/core/dataDisplay/instanceColor";

export function UserAvatar({
  user,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  user: Pick<User, "id" | "displayName">;
}) {
  return (
    <Avatar
      {...props}
      color={inferInstanceColor(user.id)}
      letter={user.displayName[0].toUpperCase()}
    />
  );
}

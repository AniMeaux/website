import {
  Avatar,
  AvatarProps,
  inferAvatarColor,
} from "#/core/dataDisplay/avatar";
import { User } from "@prisma/client";

export function UserAvatar({
  user,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  user: Pick<User, "id" | "displayName">;
}) {
  return (
    <Avatar
      {...props}
      color={inferAvatarColor(user.id)}
      letter={user.displayName[0].toUpperCase()}
    />
  );
}

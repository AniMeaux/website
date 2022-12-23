import { User } from "@prisma/client";
import {
  Avatar,
  AvatarProps,
  inferAvatarColor,
} from "~/core/dataDisplay/avatar";

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

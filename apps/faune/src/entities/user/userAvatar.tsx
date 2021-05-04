import { User } from "@animeaux/shared-entities";
import cn from "classnames";
import * as React from "react";
import { Avatar, AvatarProps } from "ui/dataDisplay/avatar";

export type UserAvatarProps = Omit<AvatarProps, "children"> & {
  user: User;
};

export function UserAvatar({ user, className, ...rest }: UserAvatarProps) {
  return (
    <Avatar {...rest} className={cn("UserAvatar", className)}>
      {user.displayName[0].toUpperCase()}
    </Avatar>
  );
}

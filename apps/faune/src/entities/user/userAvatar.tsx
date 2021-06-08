import { User } from "@animeaux/shared-entities";
import cn from "classnames";
import { Avatar, AvatarProps } from "dataDisplay/avatar";
import * as React from "react";

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

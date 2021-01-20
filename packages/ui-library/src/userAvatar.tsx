import { User } from "@animeaux/shared-entities";
import * as React from "react";
import { Avatar, AvatarProps } from "./avatar";

export type UserAvatarProps = AvatarProps & {
  user: User;
};

export function UserAvatar({ user, color = "blue", ...rest }: UserAvatarProps) {
  return (
    <Avatar {...rest} color={color}>
      {user.displayName[0].toUpperCase()}
    </Avatar>
  );
}

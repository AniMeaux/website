import { User } from "@animeaux/shared-entities";
import { Avatar, AvatarProps } from "@animeaux/ui-library";
import * as React from "react";

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

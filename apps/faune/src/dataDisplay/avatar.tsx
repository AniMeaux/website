import { User } from "@animeaux/shared-entities";
import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

export type AvatarProps = ChildrenProp &
  StyleProps & {
    small?: boolean;
  };

export function Avatar({ small = false, className, ...rest }: AvatarProps) {
  return (
    <span
      {...rest}
      className={cn("Avatar", { "Avatar--small": small }, className)}
    />
  );
}

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

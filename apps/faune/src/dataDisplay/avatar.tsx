import { User } from "@animeaux/shared-entities";
import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

export type AvatarProps = ChildrenProp & StyleProps;
export function Avatar({ className, ...rest }: AvatarProps) {
  return <span {...rest} className={cn("Avatar", className)} />;
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

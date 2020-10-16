import { User } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

type UserAvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  user: User;
};

export function UserAvatar({ user, className, ...rest }: UserAvatarProps) {
  return (
    <span
      {...rest}
      className={cn(
        "w-10 h-10 bg-blue-100 rounded-full text-blue-500 text-xl font-medium flex items-center justify-center",
        className
      )}
    >
      {user.displayName[0].toUpperCase()}
    </span>
  );
}

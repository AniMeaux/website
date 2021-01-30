import {
  Header as BaseHeader,
  HeaderBackLink,
  HeaderButtonLink,
  HeaderIconOnlyLinkPlaceholder,
  HeaderTitle,
} from "@animeaux/ui-library";
import cn from "classnames";
import * as React from "react";
import { useCurrentUser, UserAvatar, UserAvatarProps } from "./user";

function HeaderUserAvatar({ user, className, ...rest }: UserAvatarProps) {
  return (
    <span className={cn("mx-4 flex-none flex items-center", className)}>
      <UserAvatar {...rest} user={user} />
    </span>
  );
}

export type HeaderProps = {
  headerTitle: React.ReactNode;
  canGoBack?: boolean;
  action?: {
    href: string;
    icon: React.ElementType;
    label: React.ReactNode;
  };
};

export function Header({
  headerTitle,
  canGoBack = false,
  action,
}: HeaderProps) {
  const { currentUser } = useCurrentUser();

  return (
    <BaseHeader>
      {canGoBack ? (
        <HeaderBackLink href=".." />
      ) : (
        <HeaderUserAvatar user={currentUser} />
      )}

      <HeaderTitle>{headerTitle}</HeaderTitle>

      {action != null ? (
        <HeaderButtonLink href={action.href} iconOnly>
          <action.icon />
        </HeaderButtonLink>
      ) : (
        <HeaderIconOnlyLinkPlaceholder />
      )}
    </BaseHeader>
  );
}

import {
  Header as BaseHeader,
  HeaderApplicationName,
  HeaderBackLink,
  HeaderButtonLink,
  HeaderIconOnlyLinkPlaceholder,
  HeaderTitle,
  ScreenSize,
  useScreenSize,
} from "@animeaux/ui-library";
import cn from "classnames";
import * as React from "react";
import { useCurrentUser, UserAvatar, UserAvatarProps } from "./user";

function HeaderUserAvatar({ user, className, ...rest }: UserAvatarProps) {
  const { screenSize } = useScreenSize();

  return (
    <span className={cn("mx-4 flex-none flex items-center", className)}>
      {screenSize > ScreenSize.SMALL && (
        <span className="mr-2">{user.displayName}</span>
      )}

      <UserAvatar {...rest} user={user} />
    </span>
  );
}

export type HeaderProps = {
  headerTitle: React.ReactNode;
  applicationLogo: React.ElementType;
  applicationName: string;
  canGoBack?: boolean;
  action?: {
    href: string;
    icon: React.ElementType;
    label: React.ReactNode;
  };
};

export function Header({
  headerTitle,
  applicationLogo: ApplicationLogo,
  applicationName,
  canGoBack = false,
  action,
}: HeaderProps) {
  const { currentUser } = useCurrentUser();
  const { screenSize } = useScreenSize();

  if (screenSize === ScreenSize.SMALL) {
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

  return (
    <BaseHeader>
      <HeaderApplicationName
        applicationName={applicationName}
        logo={ApplicationLogo}
      />

      {canGoBack && <HeaderBackLink href=".." />}

      <HeaderTitle>{headerTitle}</HeaderTitle>

      {action != null && (
        <HeaderButtonLink href={action.href} color="blue">
          {action.label}
        </HeaderButtonLink>
      )}

      <HeaderUserAvatar user={currentUser} />
    </BaseHeader>
  );
}

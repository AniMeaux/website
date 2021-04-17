import {
  Header as BaseHeader,
  HeaderBackLink,
  HeaderLink,
  HeaderTitle,
  ScreenSize,
  useScreenSize,
} from "@animeaux/ui-library";
import * as React from "react";
import { CurrentUserProfile, useCurrentUser, UserAvatar } from "./user";

function HeaderUserAvatar() {
  const { currentUser } = useCurrentUser();
  const [
    isCurrentUserProfileVisible,
    setIsCurrentUserProfileVisible,
  ] = React.useState(false);
  const currentUserButton = React.useRef<HTMLButtonElement>(null!);

  return (
    <>
      <button
        ref={currentUserButton}
        onClick={() => setIsCurrentUserProfileVisible(true)}
        className="focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 rounded-full flex-none flex items-center active:opacity-50"
      >
        <UserAvatar user={currentUser} size="small" />
      </button>

      <CurrentUserProfile
        open={isCurrentUserProfileVisible}
        onDismiss={() => setIsCurrentUserProfileVisible(false)}
        referenceElement={currentUserButton}
      />
    </>
  );
}

export type HeaderProps = {
  headerTitle: React.ReactNode;
  canGoBack?: boolean;
  backHref?: string;
  action?: {
    href: string;
    icon: React.ElementType;
  };
};

export function Header({
  headerTitle,
  canGoBack = false,
  backHref = "..",
  action,
}: HeaderProps) {
  const { screenSize } = useScreenSize();

  let leftLink: React.ReactNode = null;
  if (canGoBack) {
    leftLink = <HeaderBackLink href={backHref} />;
  } else if (screenSize <= ScreenSize.SMALL) {
    leftLink = <HeaderUserAvatar />;
  }

  return (
    <BaseHeader>
      {leftLink}
      <HeaderTitle>{headerTitle}</HeaderTitle>

      {action != null && (
        <HeaderLink href={action.href}>
          <action.icon />
        </HeaderLink>
      )}
    </BaseHeader>
  );
}

import {
  Header as BaseHeader,
  HeaderBackLink,
  HeaderLink,
  HeaderTitle,
} from "@animeaux/ui-library";
import * as React from "react";
import {
  CurrentUserProfile,
  CurrentUserProfileHandle,
  useCurrentUser,
  UserAvatar,
} from "./user";

function HeaderUserAvatar() {
  const { currentUser } = useCurrentUser();
  const userPanel = React.useRef<CurrentUserProfileHandle>(null!);

  return (
    <>
      <button
        onClick={() => userPanel.current.open()}
        className="focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 rounded-full flex-none flex items-center active:opacity-50"
      >
        <UserAvatar user={currentUser} size="small" />
      </button>

      <CurrentUserProfile refProp={userPanel} />
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
  return (
    <BaseHeader>
      {canGoBack ? <HeaderBackLink href={backHref} /> : <HeaderUserAvatar />}
      <HeaderTitle>{headerTitle}</HeaderTitle>

      {action != null && (
        <HeaderLink href={action.href}>
          <action.icon />
        </HeaderLink>
      )}
    </BaseHeader>
  );
}

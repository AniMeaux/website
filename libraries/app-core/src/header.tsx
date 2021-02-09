import {
  Header as BaseHeader,
  HeaderBackLink,
  HeaderIconOnlyLinkPlaceholder,
  HeaderLink,
  HeaderRow,
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
        className="focus:outline-none focus-visible:ring focus-visible:ring-blue-500 rounded-full mx-4 flex-none flex items-center active:opacity-50"
      >
        <UserAvatar user={currentUser} size="xsmall" />
      </button>

      <CurrentUserProfile refProp={userPanel} />
    </>
  );
}

export type HeaderProps = React.PropsWithChildren<{
  headerTitle: React.ReactNode;
  canGoBack?: boolean;
  action?: {
    href: string;
    icon: React.ElementType;
    label: React.ReactNode;
  };
}>;

export function Header({
  headerTitle,
  canGoBack = false,
  action,
  children,
}: HeaderProps) {
  return (
    <BaseHeader>
      <HeaderRow>
        {canGoBack ? <HeaderBackLink href=".." /> : <HeaderUserAvatar />}
        <HeaderTitle>{headerTitle}</HeaderTitle>

        {action != null ? (
          <HeaderLink href={action.href}>
            <action.icon />
          </HeaderLink>
        ) : (
          <HeaderIconOnlyLinkPlaceholder />
        )}
      </HeaderRow>

      {children != null && <HeaderRow>{children}</HeaderRow>}
    </BaseHeader>
  );
}

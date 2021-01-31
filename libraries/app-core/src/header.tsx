import {
  Header as BaseHeader,
  HeaderBackLink,
  HeaderButtonLink,
  HeaderIconOnlyLinkPlaceholder,
  HeaderTitle,
} from "@animeaux/ui-library";
import * as React from "react";
import { useCurrentUser, UserAvatar } from "./user";

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
        <UserAvatar
          user={currentUser}
          size="small"
          className="mx-4 flex-none flex items-center"
        />
      )}

      <HeaderTitle>{headerTitle}</HeaderTitle>

      {action != null ? (
        <HeaderButtonLink href={action.href}>
          <action.icon />
        </HeaderButtonLink>
      ) : (
        <HeaderIconOnlyLinkPlaceholder />
      )}
    </BaseHeader>
  );
}

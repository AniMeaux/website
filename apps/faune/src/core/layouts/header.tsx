import { useCurrentUser } from "account/currentUser";
import { CurrentUserMenu } from "account/currentUserMenu";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { useIsScrollAtTheTop } from "core/layouts/usePageScroll";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import { useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import styled from "styled-components/macro";
import { theme } from "styles/theme";
import { UserAvatar } from "user/avatar";

export const HeaderLink = styled(BaseLink)`
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.dark[30]};
    }
  }

  &:active {
    background: ${theme.colors.dark[50]};
  }
`;

type HeaderBackLinkProps = Omit<BaseLinkProps, "href"> & {
  href?: BaseLinkProps["href"];
};

export function HeaderBackLink({ href = "..", ...props }: HeaderBackLinkProps) {
  return (
    <HeaderLink {...props} href={href} isBack>
      <FaChevronLeft />
    </HeaderLink>
  );
}

export const HeaderTitle = styled.h1`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 700;
  font-family: ${theme.typography.fontFamily.title};
`;

export type HeaderProps = StyleProps & ChildrenProp;
export function Header(props: HeaderProps) {
  const { isAtTheTop } = useIsScrollAtTheTop();
  return <HeaderElement {...props} $hasScroll={!isAtTheTop} />;
}

const HeaderElement = styled.header<{ $hasScroll: boolean }>`
  grid-area: header;
  z-index: ${theme.zIndex.header};
  position: sticky;
  top: 0;
  min-width: 0;
  height: 48px;
  background: ${theme.colors.background.primary};

  padding-left: ${theme.spacing.x4};
  /* The navigation is at the bottom so we need to compensate for safe area. */
  padding-left: calc(${theme.spacing.x4} + env(safe-area-inset-left, 0));

  padding-right: ${theme.spacing.x4};
  padding-right: calc(${theme.spacing.x4} + env(safe-area-inset-right, 0));

  display: flex;
  align-items: center;
  gap: ${theme.spacing.x4};

  transition-property: box-shadow;
  transition-duration: ${theme.animation.duration.fast};
  transition-timing-function: ${theme.animation.ease.move};
  box-shadow: ${(props) =>
    props.$hasScroll ? `0 1px 0 0 ${theme.colors.dark[50]}` : "none"};

  @media (min-width: ${theme.screenSizes.medium.start}) {
    height: 56px;
    padding-left: ${theme.spacing.x4};
  }

  @media (min-width: ${theme.screenSizes.large.start}) {
    height: 64px;
  }
`;

export function HeaderUserAvatar() {
  const { screenSize } = useScreenSize();
  const { currentUser } = useCurrentUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentUserButton = useRef<HTMLButtonElement>(null!);

  if (screenSize > ScreenSize.SMALL) {
    return null;
  }

  return (
    <>
      <HeaderUserAvatarButton
        ref={currentUserButton}
        onClick={() => setIsMenuVisible(true)}
      >
        <UserAvatar user={currentUser} />
      </HeaderUserAvatarButton>

      <CurrentUserMenu
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={currentUserButton}
      />
    </>
  );
}

const HeaderUserAvatarButton = styled.button`
  flex: none;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
`;

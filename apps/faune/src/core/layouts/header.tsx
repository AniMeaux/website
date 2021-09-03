import { useCurrentUser } from "account/currentUser";
import { CurrentUserMenu } from "account/currentUserMenu";
import cn from "classnames";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { UserAvatar } from "core/dataDisplay/avatar";
import { useIsScrollAtTheTop } from "core/layouts/usePageScroll";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import { useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

export function HeaderLink({ className, ...rest }: BaseLinkProps) {
  return <BaseLink {...rest} className={cn("HeaderLink", className)} />;
}

export type HeaderBackLinkProps = Omit<BaseLinkProps, "href"> & {
  href?: BaseLinkProps["href"];
};

export function HeaderBackLink({ href = "..", ...props }: HeaderBackLinkProps) {
  return (
    <HeaderLink {...props} href={href} isBack>
      <FaChevronLeft />
    </HeaderLink>
  );
}

export type HeaderTitleProps = ChildrenProp & StyleProps;
export function HeaderTitle({ className, children }: HeaderTitleProps) {
  return <h1 className={cn("HeaderTitle", className)}>{children}</h1>;
}

export type HeaderProps = StyleProps & ChildrenProp;
export function Header({ className, children }: HeaderProps) {
  const { isAtTheTop } = useIsScrollAtTheTop();

  return (
    <header
      className={cn("Header", { "Header--hasScroll": !isAtTheTop }, className)}
    >
      {children}
    </header>
  );
}

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
      <button
        ref={currentUserButton}
        onClick={() => setIsMenuVisible(true)}
        className="HeaderUserAvatar__button"
      >
        <UserAvatar user={currentUser} />
      </button>

      <CurrentUserMenu
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={currentUserButton}
      />
    </>
  );
}

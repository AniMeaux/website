import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import { UserAvatar } from "dataDisplay/avatar";
import { useCurrentUser } from "entities/user/currentUserContext";
import { CurrentUserProfile } from "entities/user/currentUserProfile";
import { useIsScrollAtTheTop } from "layouts/usePageScroll";
import * as React from "react";
import { FaChevronLeft } from "react-icons/fa";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn("HeaderLink", className)} />;
}

export type HeaderBackLinkProps = Omit<LinkProps, "href"> & {
  href?: LinkProps["href"];
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
  const [isCurrentUserProfileVisible, setIsCurrentUserProfileVisible] =
    React.useState(false);
  const currentUserButton = React.useRef<HTMLButtonElement>(null!);

  if (screenSize > ScreenSize.SMALL) {
    return null;
  }

  return (
    <>
      <button
        ref={currentUserButton}
        onClick={() => setIsCurrentUserProfileVisible(true)}
        className="HeaderUserAvatar__button"
      >
        <UserAvatar user={currentUser} />
      </button>

      <CurrentUserProfile
        open={isCurrentUserProfileVisible}
        onDismiss={() => setIsCurrentUserProfileVisible(false)}
        referenceElement={currentUserButton}
      />
    </>
  );
}

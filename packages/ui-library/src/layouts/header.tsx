import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ButtonLink, ButtonLinkProps } from "../button";
import { ScreenSize, useScreenSize } from "../screenSize";
import { UserAvatar, UserAvatarProps } from "../userAvatar";
import { useApplicationLayout } from "./applicationLayout";

export function HeaderButtonLink(props: ButtonLinkProps) {
  return <ButtonLink {...props} />;
}

export function HeaderBackLink(props: Omit<ButtonLinkProps, "iconOnly">) {
  return (
    <HeaderButtonLink {...props} iconOnly>
      <FaArrowLeft />
    </HeaderButtonLink>
  );
}

export type HeaderApplicationNameProps = React.HTMLAttributes<
  HTMLSpanElement
> & {
  logo: React.ElementType;
  applicationName: string;
};

export function HeaderApplicationName({
  logo: Logo,
  applicationName,
  className,
  ...rest
}: HeaderApplicationNameProps) {
  const { isNavigationCollapsed } = useApplicationLayout();

  return (
    <span
      {...rest}
      className={cn(
        "flex items-center",
        {
          "w-18 justify-center": isNavigationCollapsed,
          "w-64 px-4": !isNavigationCollapsed,
        },
        className
      )}
    >
      <Logo className="flex-none w-10 h-10" />

      {!isNavigationCollapsed && (
        <span className="ml-2 flex-1 min-w-0 truncate font-serif text-xl tracking-wider">
          {applicationName}
        </span>
      )}
    </span>
  );
}

export function HeaderTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      {...rest}
      className={cn(
        "flex-1 min-w-0 px-4 truncate text-center md:text-left font-bold font-serif",
        className
      )}
    />
  );
}

export function HeaderUserAvatar({
  user,
  className,
  ...rest
}: UserAvatarProps) {
  const { screenSize } = useScreenSize();

  return (
    <span className={cn("flex-none px-4 flex items-center", className)}>
      {screenSize > ScreenSize.SMALL && (
        <span className="mr-2">{user.displayName}</span>
      )}

      <UserAvatar {...rest} user={user} />
    </span>
  );
}

export function HeaderIconOnlyLinkPlaceholder() {
  return <span className="flex-none w-10" />;
}

export function HeaderGroup({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("px-4", className)} />;
}

export function Header({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn(
        "z-20 sticky top-0 w-full h-16 flex-none border-b bg-white flex items-center",
        className
      )}
    />
  );
}

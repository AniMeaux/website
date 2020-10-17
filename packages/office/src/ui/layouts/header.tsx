import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useCurrentUser } from "../../core/user";
import { UserAvatar } from "../userAvatar";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus w-10 h-10 flex-none flex items-center justify-center",
        className
      )}
    />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props}>
      <FaArrowLeft />
    </HeaderLink>
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
        "mx-2 flex-1 text-center font-semibold font-serif",
        className
      )}
    />
  );
}

export function HeaderPlaceholder() {
  return <span className="flex-none w-10" />;
}

export function HeaderAction({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "a11y-focus w-10 h-10 flex-none flex items-center justify-center",
        className
      )}
    />
  );
}

export function Header({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn(
        "z-30 fixed top-0 left-0 right-0 h-16 bg-white border-b px-2 flex items-center",
        className
      )}
    />
  );
}

export function HeaderCurrentUserAvatar() {
  const { currentUser } = useCurrentUser();

  return (
    <HeaderLink href="/profile">
      <UserAvatar user={currentUser} />
    </HeaderLink>
  );
}

import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useCurrentUser } from "../../core/user/currentUserContext";
import { CurrentUserProfile } from "../../core/user/currentUserProfile";
import { Button, ButtonClassName, ButtonProps } from "../button";
import { Dropdown } from "../dropdown";
import { UserAvatar } from "../userAvatar";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus w-10 h-10 flex-none rounded-full flex items-center justify-center",
        className
      )}
    />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props} className={ButtonClassName.secondary.default}>
      <FaArrowLeft />
    </HeaderLink>
  );
}

export function HeaderCloseLink(props: LinkProps) {
  return (
    <HeaderLink {...props} className={ButtonClassName.secondary.default}>
      <FaTimes />
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
        "mx-2 flex-1 text-center md:text-left font-bold font-serif",
        className
      )}
    />
  );
}

export function AsideHeaderTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <HeaderTitle {...rest} className={cn("md:text-center", className)} />;
}

export function HeaderPlaceholder() {
  return <span className="flex-none w-10" />;
}

export function HeaderAction({ className, ...rest }: ButtonProps) {
  return (
    <Button
      {...rest}
      iconOnly
      className={cn("flex-none flex items-center justify-center", className)}
    />
  );
}

export function HeaderCurrentUserAvatar() {
  const { currentUser } = useCurrentUser();
  const actionButton = React.useRef<HTMLButtonElement>(null!);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);

  return (
    <>
      <HeaderAction
        onClick={() => setIsDropdownVisible((v) => !v)}
        refProp={actionButton}
      >
        <UserAvatar user={currentUser} />
      </HeaderAction>

      {isDropdownVisible && (
        <Dropdown
          onClose={() => setIsDropdownVisible(false)}
          actionElement={actionButton}
        >
          <CurrentUserProfile />
        </Dropdown>
      )}
    </>
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
        "z-20 sticky top-0 w-full h-16 flex-none border-b bg-white px-2 flex items-center",
        className
      )}
    />
  );
}

import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useIsScrollAtTheTop } from "ui/layouts/usePageScroll";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn("HeaderLink", className)} />;
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props} isBack>
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

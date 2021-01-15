import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ButtonClassName } from "../button";
import { Link, LinkProps } from "../link";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus w-10 h-10 flex-none rounded-full flex items-center justify-center",
        ButtonClassName.secondary.default.base,
        ButtonClassName.secondary.default.enabled,
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
        "mx-2 flex-1 min-w-0 truncate text-center md:text-left font-bold font-serif",
        className
      )}
    />
  );
}

export function HeaderPlaceholder() {
  return <span className="flex-none w-10" />;
}

export function Header({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn(
        "z-20 sticky top-0 w-full h-16 flex-none border-b bg-white px-4 flex items-center justify-between",
        className
      )}
    />
  );
}

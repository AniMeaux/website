import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, LinkProps } from "../link";
import { useIsScrollAtTheTop } from "./usePageScroll";

const HEADER_ACTION_CLASS_NAMES =
  "mx-4 a11y-focus w-8 h-8 flex-none flex items-center justify-center text-xl text-gray-800 active:text-opacity-20";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link {...rest} className={cn(HEADER_ACTION_CLASS_NAMES, className)} />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props}>
      <FaArrowLeft />
    </HeaderLink>
  );
}

export function HeaderButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cn(HEADER_ACTION_CLASS_NAMES, className)} />
  );
}

export function HeaderBackButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <HeaderButton {...props}>
      <FaArrowLeft />
    </HeaderButton>
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
        "mx-4 flex-1 min-w-0 truncate text-gray-800 text-center font-bold font-serif",
        className
      )}
    />
  );
}

export function HeaderIconOnlyLinkPlaceholder() {
  return <span className="mx-4 w-10 flex-none" />;
}

export function Header({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  const { isAtTheTop } = useIsScrollAtTheTop();

  return (
    <header
      {...rest}
      className={cn(
        "z-20 fixed top-0 left-0 right-0 ring-1 bg-white w-full h-12 safe-area-px flex-none flex items-center transition-shadow duration-200 ease-in-out",
        {
          "ring-transparent": isAtTheTop,
          "ring-gray-100": !isAtTheTop,
        },
        className
      )}
    />
  );
}

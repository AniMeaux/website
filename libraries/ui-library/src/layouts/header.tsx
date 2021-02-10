import cn from "classnames";
import * as React from "react";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { Link, LinkProps } from "../core";
import { useIsScrollAtTheTop } from "./usePageScroll";

const HEADER_ACTION_CLASS_NAMES =
  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 rounded-full w-8 h-8 flex-none flex items-center justify-center text-xl text-gray-800 active:text-opacity-20";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link {...rest} className={cn(HEADER_ACTION_CLASS_NAMES, className)} />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props}>
      <FaChevronLeft />
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
      <FaChevronLeft />
    </HeaderButton>
  );
}

export function HeaderCloseButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <HeaderButton {...props}>
      <FaTimes />
    </HeaderButton>
  );
}

type HeaderTitleAlign = "left" | "center";

type HeaderTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  align?: HeaderTitleAlign;
};

const HeaderTitleAlignClassName: {
  [key in HeaderTitleAlign]: string;
} = {
  center: "text-center",
  left: "text-left",
};

export function HeaderTitle({
  align = "center",
  className,
  ...rest
}: HeaderTitleProps) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      {...rest}
      className={cn(
        "flex-1 min-w-0 truncate text-gray-800 font-bold font-serif",
        HeaderTitleAlignClassName[align],
        className
      )}
    />
  );
}

export function HeaderIconOnlyLinkPlaceholder() {
  return <span className="w-10 flex-none" />;
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
        "transition-shadow duration-200 ease-in-out z-20 fixed top-0 left-0 right-0 ring-1 bg-white w-full h-12 flex-none header-padding flex items-center space-x-2",
        {
          "ring-transparent": isAtTheTop,
          "ring-gray-100": !isAtTheTop,
        },
        className
      )}
    />
  );
}

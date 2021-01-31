import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, LinkProps } from "../link";
import { usePageScroll } from "./usePageScroll";

export function HeaderButtonLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "mx-4 a11y-focus w-8 h-8 flex-none flex items-center justify-center text-xl text-gray-800 active:text-opacity-20",
        className
      )}
    />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderButtonLink {...props}>
      <FaArrowLeft />
    </HeaderButtonLink>
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
  const { isAtTheTop } = usePageScroll();

  return (
    <header
      {...rest}
      className={cn(
        "z-20 sticky top-0 w-full h-12 flex-none flex items-center transition-colors duration-200 ease-in-out",
        {
          "bg-white": isAtTheTop,
          "bg-gray-50": !isAtTheTop,
        },
        className
      )}
    />
  );
}

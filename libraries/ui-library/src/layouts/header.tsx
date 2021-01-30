import cn from "classnames";
import * as React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ButtonLink, ButtonLinkProps } from "../button";

export function HeaderButtonLink({ className, ...rest }: ButtonLinkProps) {
  return <ButtonLink {...rest} className={cn("mx-4 flex-none", className)} />;
}

export function HeaderBackLink(props: Omit<ButtonLinkProps, "iconOnly">) {
  return (
    <HeaderButtonLink {...props} iconOnly>
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
        "mx-4 flex-1 min-w-0 truncate text-center font-bold font-serif",
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

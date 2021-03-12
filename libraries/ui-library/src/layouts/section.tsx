import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

export function SectionTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2
      {...rest}
      className={cn(
        "my-2 px-2 truncate text-lg font-bold font-serif",
        className
      )}
    />
  );
}

export function Section({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <section {...rest} className={cn("p-2", className)} />;
}

type ButtonSectionProps = ChildrenProp & StyleProps;

export function ButtonSection({ className, ...rest }: ButtonSectionProps) {
  return (
    <section
      {...rest}
      className={cn("p-4 flex flex-col space-y-4", className)}
    />
  );
}

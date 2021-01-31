import cn from "classnames";
import * as React from "react";

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
        "mb-2 px-2 text-xs uppercase tracking-wide text-gray-600",
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

export function ActionSection({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <section {...rest} className={cn("py-2 px-4", className)} />;
}

export function ActionSectionList({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <div {...rest} className={cn("flex flex-col space-y-4", className)} />;
}

export function MessageSection({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <section {...rest} className={cn("py-2 px-4 space-y-4", className)} />;
}

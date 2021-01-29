import cn from "classnames";
import * as React from "react";
import { CONTENT_CLASS_NAMES } from "./shared";

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
  return (
    <section
      {...rest}
      className={cn(
        CONTENT_CLASS_NAMES,
        "md:bg-white md:border md:rounded px-2 md:py-4",
        className
      )}
    />
  );
}

export function ActionSection({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...rest}
      className={cn(CONTENT_CLASS_NAMES, "px-4 md:px-0 md:py-4", className)}
    />
  );
}

export function ActionSectionList({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-4",
        className
      )}
    />
  );
}

export function MessageSection({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...rest}
      className={cn(
        CONTENT_CLASS_NAMES,
        "mb-8 px-4 md:px-0 space-y-4",
        className
      )}
    />
  );
}

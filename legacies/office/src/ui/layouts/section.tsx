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
  return <section {...rest} className={cn("px-2", className)} />;
}

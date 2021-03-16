import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

export function SectionTitle({
  className,
  ...rest
}: StyleProps & ChildrenProp) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2
      {...rest}
      className={cn("my-2 px-2 text-lg font-bold font-serif", className)}
    />
  );
}

type SectionProps = StyleProps & ChildrenProp;

export function Section({ className, ...rest }: SectionProps) {
  return <section {...rest} className={cn("p-2", className)} />;
}

export function ButtonSection({ className, ...rest }: SectionProps) {
  return (
    <section
      {...rest}
      className={cn("p-4 flex flex-col space-y-4", className)}
    />
  );
}

export function SectionBox({ className, ...rest }: SectionProps) {
  return (
    <Section
      {...rest}
      className={cn("mx-4 bg-black bg-opacity-3 rounded-xl", className)}
    />
  );
}

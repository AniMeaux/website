import cn from "classnames";
import * as React from "react";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  hasPrimaryAction?: boolean;
};

export function Main({
  hasPrimaryAction = false,
  className,
  ...rest
}: MainProps) {
  return (
    <main
      {...rest}
      className={cn("pt-4", { "pb-20": hasPrimaryAction }, className)}
    />
  );
}

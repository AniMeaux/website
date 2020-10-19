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
      className={cn("py-20", { "pb-40": hasPrimaryAction }, className)}
    />
  );
}

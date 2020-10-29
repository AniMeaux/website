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
      className={cn(
        "md:flex-1 md:min-w-0 md:min-h-0 md:overflow-auto pt-4 pb-20 md:pb-4",
        { "pb-36 md:pb-20": hasPrimaryAction },
        className
      )}
    />
  );
}

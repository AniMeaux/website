import cn from "classnames";
import * as React from "react";

export * from "react-spring-bottom-sheet";

export function BottomSheetHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn("w-full h-12 flex-none flex items-center", className)}
    />
  );
}

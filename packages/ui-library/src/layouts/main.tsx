import cn from "classnames";
import * as React from "react";

export function Main({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <main {...rest} className={cn("pt-4 pb-16", className)} />;
}

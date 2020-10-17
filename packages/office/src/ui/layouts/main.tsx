import cn from "classnames";
import * as React from "react";

export function Main({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return <main {...rest} className={cn("py-20", className)} />;
}

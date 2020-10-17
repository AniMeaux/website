import cn from "classnames";
import * as React from "react";
import { Separator } from "../separator";

export function Main({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main {...rest} className={cn("py-16", className)}>
      <Separator large className="mb-2" />
      {children}
    </main>
  );
}

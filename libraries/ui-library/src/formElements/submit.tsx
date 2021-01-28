import cn from "classnames";
import * as React from "react";

export function Submit({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn("p-2 flex flex-col", className)} />;
}

import cn from "classnames";
import * as React from "react";

export function EmptyMessage({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...rest} className={cn("h-12 px-2 flex items-center", className)} />
  );
}

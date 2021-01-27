import cn from "classnames";
import * as React from "react";

export function RequiredStar({
  className,
  ...rest
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children">) {
  return (
    <span {...rest} className={cn("text-red-500 font-bold", className)}>
      *
    </span>
  );
}

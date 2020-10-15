import cn from "classnames";
import * as React from "react";

export function ErrorMessage({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <p
      {...rest}
      className={cn(
        "bg-red-50 px-4 py-2 rounded-lg text-sm text-red-500 font-medium",
        className
      )}
    />
  );
}

import cn from "classnames";
import * as React from "react";

export function Label({
  className,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...rest} className={cn("pb-1 text-sm text-gray-600", className)} />
  );
}

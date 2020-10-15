import cn from "classnames";
import * as React from "react";

export function Button({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "h-10 disabled:opacity-75 bg-blue-500 rounded-md px-4 text-sm text-white uppercase tracking-wide font-medium a11y-focus",
        className
      )}
    />
  );
}

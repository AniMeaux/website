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
        "h-10 bg-blue-500 rounded-md px-4 text-white font-medium a11y-focus",
        className
      )}
    />
  );
}

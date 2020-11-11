import cn from "classnames";
import * as React from "react";

export function Adornment({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn("w-8 h-8 flex items-center justify-center", className)}
    />
  );
}

export function ActionAdornment({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      // Use type button to make sure we don't submit a form.
      type="button"
      className={cn(
        "w-8 h-8 flex items-center justify-center pointer-events-auto",
        className
      )}
    />
  );
}

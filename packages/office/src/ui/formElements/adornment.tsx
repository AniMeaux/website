import cn from "classnames";
import * as React from "react";

export function Adornment({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cn("p-2", className)} />;
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
      className={cn("p-2", className)}
    />
  );
}

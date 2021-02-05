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

type ActionAdornmentProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  refProp?: React.RefObject<HTMLButtonElement>;
};

export function ActionAdornment({
  refProp,
  className,
  ...props
}: ActionAdornmentProps) {
  return (
    <button
      {...props}
      // Use type button to make sure we don't submit a form.
      type="button"
      ref={refProp}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-inset focus-visible:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center pointer-events-auto text-black text-opacity-70 active:text-opacity-20",
        className
      )}
    />
  );
}

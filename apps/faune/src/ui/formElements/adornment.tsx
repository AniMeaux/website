import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

export function Adornment({ className, children }: StyleProps & ChildrenProp) {
  return (
    <span className={cn("w-8 h-8 flex items-center justify-center", className)}>
      {children}
    </span>
  );
}

type ActionAdornmentProps = ChildrenProp &
  StyleProps & {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export const ActionAdornment = React.forwardRef<
  HTMLButtonElement,
  ActionAdornmentProps
>(function ActionAdornment({ onClick, children, className }, ref) {
  return (
    <button
      // Use type button to make sure we don't submit a form.
      type="button"
      onClick={onClick}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-inset focus-visible:ring-blue-500 focus-visible:ring-opacity-50 rounded-full w-8 h-8 flex items-center justify-center pointer-events-auto text-black text-opacity-70 active:text-opacity-20",
        className
      )}
      ref={ref}
    >
      {children}
    </button>
  );
});

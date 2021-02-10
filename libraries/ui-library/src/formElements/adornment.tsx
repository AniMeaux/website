import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

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

export function ActionAdornment({
  onClick,
  children,
  className,
}: ActionAdornmentProps) {
  return (
    <button
      // Use type button to make sure we don't submit a form.
      type="button"
      onClick={onClick}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-inset focus-visible:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center pointer-events-auto text-black text-opacity-70 active:text-opacity-20",
        className
      )}
    >
      {children}
    </button>
  );
}

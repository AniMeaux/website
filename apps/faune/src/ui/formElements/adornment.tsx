import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import { forwardRef } from "react";

export function Adornment({ className, children }: StyleProps & ChildrenProp) {
  return <span className={cn("Adornment", className)}>{children}</span>;
}

type ActionAdornmentProps = ChildrenProp &
  StyleProps & {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export const ActionAdornment = forwardRef<
  HTMLButtonElement,
  ActionAdornmentProps
>(function ActionAdornment({ onClick, children, className }, ref) {
  return (
    <button
      // Use type button to make sure we don't submit a form.
      type="button"
      onClick={onClick}
      className={cn("Adornment Adornment--action", className)}
      ref={ref}
    >
      {children}
    </button>
  );
});

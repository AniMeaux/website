import cn from "classnames";
import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  visible?: boolean;
};

export function Badge({
  visible = false,
  children,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span {...rest} className={cn("relative", className)}>
      {children}
      {visible && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      )}
    </span>
  );
}

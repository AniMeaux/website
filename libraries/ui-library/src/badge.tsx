import cn from "classnames";
import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  value?: React.ReactNode;
};

export function Badge({ value, children, className, ...rest }: BadgeProps) {
  let badge: React.ReactNode = null;

  if (value != null) {
    badge = (
      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 ring-2 ring-white w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-2xs text-white font-bold">
        {value}
      </span>
    );
  }

  return (
    <span {...rest} className={cn("relative", className)}>
      {children}
      {badge}
    </span>
  );
}

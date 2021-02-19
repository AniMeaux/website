import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

type BadgeProps = StyleProps &
  ChildrenProp & {
    isVisible?: boolean;
  };

export function Badge({ isVisible, children, className }: BadgeProps) {
  let badge: React.ReactNode = null;

  if (isVisible) {
    badge = (
      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 ring-2 ring-white w-2 h-2 rounded-full bg-blue-500" />
    );
  }

  return (
    <span className={cn("relative", className)}>
      {children}
      {badge}
    </span>
  );
}

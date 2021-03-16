import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

export type EmptyMessageProps = ChildrenProp &
  StyleProps & {
    action?: React.ReactNode;
  };

export function EmptyMessage({
  children,
  action,
  className,
}: EmptyMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <p className="max-w-full py-8 px-4 text-center">{children}</p>
      {action}
    </div>
  );
}

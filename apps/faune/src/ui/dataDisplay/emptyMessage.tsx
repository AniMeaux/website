import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

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

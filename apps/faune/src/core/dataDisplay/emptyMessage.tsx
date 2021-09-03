import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

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
    <div className={cn("EmptyMessage", className)}>
      <p className="EmptyMessage__text">{children}</p>
      {action}
    </div>
  );
}

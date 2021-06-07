import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

type BadgeProps = StyleProps &
  ChildrenProp & {
    isVisible?: boolean;
  };

export function Badge({ isVisible, children, className }: BadgeProps) {
  let badge: React.ReactNode = null;

  if (isVisible) {
    badge = <span className="Badge" />;
  }

  return (
    <span className={cn("Badge__wrapper", className)}>
      {children}
      {badge}
    </span>
  );
}

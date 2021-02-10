import cn from "classnames";
import * as React from "react";
import { FaCheckCircle, FaCircle, FaDotCircle } from "react-icons/fa";
import { ChildrenProp, Link, LinkProps, StyleProps } from "../core";

export enum StepStatus {
  PENDING,
  IN_PROGRESS,
  DONE,
}

const StepLinkStatusIconClassName: { [key in StepStatus]: string } = {
  [StepStatus.PENDING]: "text-black text-opacity-10",
  [StepStatus.IN_PROGRESS]: "text-blue-500",
  [StepStatus.DONE]: "text-blue-500",
};

const StepLinkStatusIcon: { [key in StepStatus]: React.ElementType } = {
  [StepStatus.PENDING]: FaCircle,
  [StepStatus.IN_PROGRESS]: FaDotCircle,
  [StepStatus.DONE]: FaCheckCircle,
};

type StepLinkProps = Omit<LinkProps, "disabled"> &
  StyleProps & {
    status: StepStatus;
  };

export function StepLink({ status, href, children, className }: StepLinkProps) {
  const Icon = StepLinkStatusIcon[status];

  return (
    <Link
      href={href}
      disabled={status === StepStatus.PENDING}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 rounded-xl max-w-full flex flex-col items-center text-xs text-center text-black text-opacity-50 active:opacity-60",
        className
      )}
    >
      <Icon
        className={cn("mb-1 w-5 h-5", StepLinkStatusIconClassName[status])}
      />

      <span className="px-4 max-w-full truncate">{children}</span>
    </Link>
  );
}

const StepLineStatusClassName: { [key in StepStatus]: string } = {
  [StepStatus.PENDING]: "bg-black bg-opacity-10",
  [StepStatus.IN_PROGRESS]: "bg-blue-500",
  [StepStatus.DONE]: "bg-blue-500",
};

type StepItemProps = StyleProps & {
  children: React.ReactElement<StepLinkProps>;
  isFirst?: boolean;
};

export function StepItem({
  isFirst = false,
  className,
  children,
}: StepItemProps) {
  const status = children.props.status;

  return (
    <li
      className={cn(
        "relative flex-1 min-w-0 flex flex-col items-center",
        className
      )}
    >
      {!isFirst && (
        <span
          className={cn(
            "absolute top-2.5 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full step-item-line-width h-1",
            StepLineStatusClassName[status]
          )}
        />
      )}

      {children}
    </li>
  );
}

type StepperProps = StyleProps & ChildrenProp;

export function Stepper({ className, children }: StepperProps) {
  return (
    <ul className={cn("w-full h-16 flex items-center", className)}>
      {React.Children.toArray(children).map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isFirst: index === 0 });
        }

        return child;
      })}
    </ul>
  );
}

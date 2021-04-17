import cn from "classnames";
import * as React from "react";
import { FaCheckCircle, FaCircle, FaDotCircle } from "react-icons/fa";
import { ChildrenProp, Link, LinkProps, StyleProps } from "../core";

export type StepperProps = StyleProps & ChildrenProp;
export function Stepper({ className, ...rest }: StepperProps) {
  return <ul {...rest} className={cn("Stepper", className)} />;
}

export enum StepStatus {
  PENDING,
  IN_PROGRESS,
  DONE,
}

const StepItemStatusClassName: { [key in StepStatus]: string } = {
  [StepStatus.PENDING]: "StepItem--isPending",
  [StepStatus.IN_PROGRESS]: "StepItem--isInProgress",
  [StepStatus.DONE]: "StepItem--isDone",
};

type StepItemProps = StyleProps & {
  children: React.ReactElement<StepLinkProps>;
};

export function StepItem({ className, children, ...rest }: StepItemProps) {
  const status = children.props.status;

  return (
    <li
      {...rest}
      className={cn("StepItem", StepItemStatusClassName[status], className)}
    >
      {children}
    </li>
  );
}

const StepLinkStatusIconClassName: { [key in StepStatus]: string } = {
  [StepStatus.PENDING]: "StepLink__icon--isPending",
  [StepStatus.IN_PROGRESS]: "StepLink__icon--isInProgress",
  [StepStatus.DONE]: "StepLink__icon--isDone",
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

export function StepLink({
  status,
  children,
  className,
  ...rest
}: StepLinkProps) {
  const Icon = StepLinkStatusIcon[status];
  const disabled = status === StepStatus.PENDING;

  return (
    <Link
      {...rest}
      disabled={disabled}
      className={cn(
        "StepLink",
        { "StepLink--isDisabled": disabled },
        className
      )}
    >
      <Icon
        className={cn("StepLink__icon", StepLinkStatusIconClassName[status])}
      />

      <span className="StepLink__label">{children}</span>
    </Link>
  );
}

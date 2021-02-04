import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import { FaCheckCircle, FaCircle, FaDotCircle } from "react-icons/fa";
import { Link, LinkProps } from "./link";

export enum StepStatus {
  PENDING,
  IN_PROGRESS,
  DONE,
}

type StepLinkProps = LinkProps & {
  status: StepStatus;
};

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

export function StepLink({
  className,
  status,
  children,
  ...rest
}: StepLinkProps) {
  const Icon = StepLinkStatusIcon[status];
  const Tag = status === StepStatus.PENDING ? "span" : Link;

  return (
    <Tag
      {...rest}
      className={cn(
        "max-w-full flex flex-col items-center text-xs text-center text-default-color text-opacity-70",
        className
      )}
    >
      <Icon
        className={cn("mb-1 w-5 h-5", StepLinkStatusIconClassName[status])}
      />

      <span className="px-4 max-w-full truncate">{children}</span>
    </Tag>
  );
}

const StepLineStatusClassName: { [key in StepStatus]: string } = {
  [StepStatus.PENDING]: "bg-black bg-opacity-10",
  [StepStatus.IN_PROGRESS]: "bg-blue-500",
  [StepStatus.DONE]: "bg-blue-500",
};

type StepItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  isFirst?: boolean;
};

export function StepItem({
  isFirst = false,
  className,
  children,
  ...rest
}: StepItemProps) {
  const child = React.Children.only(children);

  invariant(
    React.isValidElement(child),
    "Only a React Element is allowed as children of StepItem"
  );

  const status = (child as React.ReactElement<StepLinkProps>).props.status;

  return (
    <li
      {...rest}
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

export function Stepper({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul {...rest} className={cn("w-full h-16 flex items-center", className)}>
      {React.Children.toArray(children).map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isFirst: index === 0 });
        }

        return child;
      })}
    </ul>
  );
}

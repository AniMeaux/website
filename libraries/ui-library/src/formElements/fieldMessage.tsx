import cn from "classnames";
import * as React from "react";

type FieldMessageProps = Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "children"
> & {
  infoMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
};

const COMMON_CLASS_NAME = "mt-1 px-4 text-xs";

export function FieldMessage({
  infoMessage,
  errorMessage,
  className,
  ...rest
}: FieldMessageProps) {
  if (errorMessage != null) {
    return (
      <p {...rest} className={cn(COMMON_CLASS_NAME, "text-red-500", className)}>
        {errorMessage}
      </p>
    );
  }

  if (infoMessage != null) {
    return (
      <p
        {...rest}
        className={cn(
          COMMON_CLASS_NAME,
          "text-black text-opacity-60",
          className
        )}
      >
        {infoMessage}
      </p>
    );
  }

  return null;
}

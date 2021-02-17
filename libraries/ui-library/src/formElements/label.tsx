import cn from "classnames";
import * as React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  isOptional?: boolean;
  hasError?: boolean;
};

export function Label({
  isOptional = false,
  hasError = false,
  children,
  className,
  ...rest
}: LabelProps) {
  return (
    <label
      {...rest}
      className={cn(
        "select-none mb-1 px-4 text-sm",
        {
          "text-black text-opacity-60": !hasError,
          "text-red-500": hasError,
        },
        className
      )}
    >
      {children}
      {isOptional && " (Optionnel)"}
    </label>
  );
}

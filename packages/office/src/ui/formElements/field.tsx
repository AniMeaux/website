import cn from "classnames";
import * as React from "react";

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  alignItems?: "stretch" | "end";
};

export function Field({ alignItems, className, ...rest }: FieldProps) {
  return (
    <div
      {...rest}
      className={cn(
        "pt-4 flex flex-col",
        { "items-end": alignItems === "end" },
        className
      )}
    />
  );
}

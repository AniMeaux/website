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
        "p-2 flex flex-col",
        { "items-end": alignItems === "end" },
        className
      )}
    />
  );
}

export function CheckboxField({
  className,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...rest}
      className={cn("w-full h-10 flex items-center", className)}
    />
  );
}

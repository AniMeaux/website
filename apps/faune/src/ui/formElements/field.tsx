import cn from "classnames";
import * as React from "react";

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  row?: boolean;
};

export function Field({ row = false, className, ...rest }: FieldProps) {
  return (
    <div
      {...rest}
      className={cn("px-4 py-2 flex", { "flex-col": !row }, className)}
    />
  );
}

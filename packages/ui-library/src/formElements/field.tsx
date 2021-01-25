import cn from "classnames";
import * as React from "react";

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  row?: boolean;
};

export function Field({ row = false, className, ...rest }: FieldProps) {
  return (
    <div
      {...rest}
      className={cn("p-2 flex", { "flex-col": !row }, className)}
    />
  );
}

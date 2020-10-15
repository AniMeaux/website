import cn from "classnames";
import * as React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  inline?: boolean;
};

export function Label({ inline = false, className, ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      className={cn(
        { "pl-1": inline, "pb-1 text-sm text-gray-600": !inline },
        className
      )}
    />
  );
}

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
        { "pl-1": inline, "text-gray-600 pb-1": !inline },
        className
      )}
    />
  );
}

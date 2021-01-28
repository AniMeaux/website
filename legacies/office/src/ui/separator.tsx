import cn from "classnames";
import * as React from "react";

type SeparatorProps = React.HTMLAttributes<HTMLHRElement> & {
  noBorder?: boolean;
};

export function Separator({
  noBorder = false,
  className,
  ...rest
}: SeparatorProps) {
  return (
    <hr
      {...rest}
      className={cn(
        "my-4 border-t",
        { "border-transparent": noBorder },
        className
      )}
    />
  );
}

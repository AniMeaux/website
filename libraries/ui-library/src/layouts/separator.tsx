import cn from "classnames";
import * as React from "react";
import { CONTENT_CLASS_NAMES } from "./shared";

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
        CONTENT_CLASS_NAMES,
        "my-4 border-t md:border-transparent",
        { "border-transparent": noBorder },
        className
      )}
    />
  );
}

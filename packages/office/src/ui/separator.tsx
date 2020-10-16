import cn from "classnames";
import * as React from "react";

type SeparatorProps = React.HTMLAttributes<HTMLHRElement> & {
  large?: boolean;
};

export function Separator({
  large = false,
  className,
  ...rest
}: SeparatorProps) {
  return <hr {...rest} className={cn({ "border-t-8": large }, className)} />;
}

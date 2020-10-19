import cn from "classnames";
import * as React from "react";

export function Separator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHRElement>) {
  return <hr {...rest} className={cn("my-4 border-t", className)} />;
}

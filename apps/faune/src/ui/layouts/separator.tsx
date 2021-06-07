import { StyleProps } from "core/types";
import cn from "classnames";

type SeparatorProps = StyleProps;
export function Separator({ className, ...rest }: SeparatorProps) {
  return <hr {...rest} className={cn("Separator", className)} />;
}

import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

type FieldProps = ChildrenProp & StyleProps;
export function Field({ className, ...rest }: FieldProps) {
  return <div {...rest} className={cn("Field", className)} />;
}

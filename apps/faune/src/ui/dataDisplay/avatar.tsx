import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

export type AvatarProps = ChildrenProp & StyleProps;
export function Avatar({ className, ...rest }: AvatarProps) {
  return <span {...rest} className={cn("Avatar", className)} />;
}

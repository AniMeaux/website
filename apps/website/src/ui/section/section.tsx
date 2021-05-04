import cn from "classnames";
import * as React from "react";
import { StyleProps } from "../../core/types";

type SectionProps = StyleProps & {
  children: React.ReactElement;
};

export function Section({ children, className }: SectionProps) {
  return React.cloneElement(children, {
    className: cn("Section", className, children.props.className),
  });
}
